import { Router } from 'express';
import { prisma } from './prisma.ts';
import { AuthenticatedRequest, authenticateAny, requireRoles } from './auth.ts';

const router = Router();
router.use(authenticateAny);
const ADMIN = ['SUPER_ADMIN','ADMIN','PRINCIPAL','ACADEMIC_HEAD'] as any;

const day = (v: string) => { const d = new Date(v); d.setHours(0,0,0,0); return d; };
const grade = (marks:number, max:number) => {
  const p=max>0?(marks/max)*100:0;
  if(p>=90)return'A+'; if(p>=80)return'A'; if(p>=70)return'B'; if(p>=60)return'C'; if(p>=50)return'D'; return'F';
};

router.get('/attendance', async (req: AuthenticatedRequest,res) => {
  const user=req.authUser!;
  const where:any={};
  if(user.role==='STUDENT') where.studentId=user.studentId||'__none__';
  if(user.role==='PARENT') where.student={parentId:user.parentId||'__none__'};
  if(req.query.studentId && user.role!=='STUDENT') where.studentId=String(req.query.studentId);
  if(req.query.date) where.date=day(String(req.query.date));
  const rows=await prisma.attendance.findMany({where,include:{student:true},orderBy:{date:'desc'}});
  res.json(rows);
});

router.post('/attendance',requireRoles(ADMIN,'TEACHER' as any),async(req,res)=>{
  const {studentId,date,status,remarks}=req.body;
  if(!studentId||!date||!status)return res.status(400).json({error:'Student, date and status are required'});
  const d=day(String(date));
  const row=await prisma.attendance.upsert({where:{studentId_date:{studentId:String(studentId),date:d}},update:{status:String(status),remarks:remarks||null},create:{studentId:String(studentId),date:d,status:String(status),remarks:remarks||null}});
  res.status(201).json(row);
});

router.get('/assignments',async(req:AuthenticatedRequest,res)=>{
  const where:any={};
  if(req.query.subjectId)where.subjectId=String(req.query.subjectId);
  if(req.query.teacherId)where.teacherId=String(req.query.teacherId);
  if(req.authUser!.role==='TEACHER')where.teacherId=req.authUser!.teacherId||'__none__';
  const rows=await prisma.assignment.findMany({where,include:{subject:true,teacher:true},orderBy:{dueDate:'asc'}});
  res.json(rows);
});

router.post('/assignments',requireRoles(ADMIN,'TEACHER' as any),async(req,res)=>{
  const {subjectId,teacherId,title,description,dueDate}=req.body;
  if(!subjectId||!teacherId||!title||!description||!dueDate)return res.status(400).json({error:'Subject, teacher, title, description and due date are required'});
  const row=await prisma.assignment.create({data:{subjectId:String(subjectId),teacherId:String(teacherId),title:String(title).trim(),description:String(description).trim(),dueDate:new Date(dueDate)},include:{subject:true,teacher:true}});
  res.status(201).json(row);
});

router.put('/assignments/:id',requireRoles(ADMIN,'TEACHER' as any),async(req,res)=>{
  const {title,description,dueDate}=req.body;
  const row=await prisma.assignment.update({where:{id:req.params.id},data:{...(title!==undefined?{title:String(title).trim()}:{}),...(description!==undefined?{description:String(description).trim()}:{}),...(dueDate!==undefined?{dueDate:new Date(dueDate)}:{})}});
  res.json(row);
});

router.get('/exams',async(req,res)=>{
  const where:any={};
  if(req.query.termId)where.termId=String(req.query.termId);
  if(req.query.subjectId)where.subjectId=String(req.query.subjectId);
  const rows=await prisma.exam.findMany({where,include:{term:true,subject:true,results:{include:{student:true}}},orderBy:{date:'desc'}});
  res.json(rows);
});

router.post('/exams',requireRoles(ADMIN,'TEACHER' as any),async(req,res)=>{
  const {termId,subjectId,title,maxMarks,date}=req.body;
  if(!termId||!subjectId||!title||!date)return res.status(400).json({error:'Term, subject, title and date are required'});
  const row=await prisma.exam.create({data:{termId:String(termId),subjectId:String(subjectId),title:String(title).trim(),maxMarks:Number(maxMarks??100),date:new Date(date)},include:{term:true,subject:true}});
  res.status(201).json(row);
});

router.post('/exams/:examId/results',requireRoles(ADMIN,'TEACHER' as any),async(req,res)=>{
  const {studentId,marksObtained,remarks}=req.body;
  const exam=await prisma.exam.findUnique({where:{id:req.params.examId}});
  if(!exam)return res.status(404).json({error:'Exam not found'});
  const marks=Number(marksObtained);
  if(!studentId||!Number.isFinite(marks)||marks<0||marks>exam.maxMarks)return res.status(400).json({error:'Valid student and marks within exam maximum are required'});
  const row=await prisma.examResult.upsert({where:{examId_studentId:{examId:exam.id,studentId:String(studentId)}},update:{marksObtained:marks,grade:grade(marks,exam.maxMarks),remarks:remarks||null},create:{examId:exam.id,studentId:String(studentId),marksObtained:marks,grade:grade(marks,exam.maxMarks),remarks:remarks||null}},include:{student:true,exam:true}});
  res.status(201).json(row);
});

router.get('/results',async(req:AuthenticatedRequest,res)=>{
  const where:any={};
  if(req.query.examId)where.examId=String(req.query.examId);
  if(req.query.studentId && req.authUser!.role!=='STUDENT')where.studentId=String(req.query.studentId);
  if(req.authUser!.role==='STUDENT')where.studentId=req.authUser!.studentId||'__none__';
  if(req.authUser!.role==='PARENT')where.student={parentId:req.authUser!.parentId||'__none__'};
  const rows=await prisma.examResult.findMany({where,include:{exam:{include:{subject:true,term:true}},student:true},orderBy:{createdAt:'desc'}});
  res.json(rows);
});

export default router;
