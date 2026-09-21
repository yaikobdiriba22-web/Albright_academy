import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  AlertTriangle,
  Tag,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { GalleryImage, GalleryCategory } from '../../types/index.ts';
import { Button } from '../../components/ui/Button.tsx';
import { Modal } from '../../components/ui/Modal.tsx';

interface AdminGalleryViewProps {
  onDataChanged: () => void;
}

export const AdminGalleryView: React.FC<AdminGalleryViewProps> = ({
  onDataChanged,
}) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('All');
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<GalleryImage | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('School');
  const [imageUrl, setImageUrl] = useState('');

  const categories: GalleryCategory[] = [
    'All',
    'School',
    'Classrooms',
    'Students',
    'Events',
    'Sports',
    'Activities',
  ];

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const data = await api.getGallery(selectedCategory);
      setImages(data);
    } catch (err) {
      console.error('Failed to load gallery', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      alert('Please provide a title and an image URL.');
      return;
    }

    setIsSaving(true);
    try {
      await api.createGalleryImage({
        title,
        description,
        category,
        imageUrl,
      });
      setIsFormOpen(false);
      setTitle('');
      setDescription('');
      setImageUrl('');
      fetchImages();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to upload photo to gallery.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await api.deleteGalleryImage(deletingItem.id);
      setDeletingItem(null);
      fetchImages();
      onDataChanged();
    } catch (err: any) {
      alert(err.message || 'Failed to remove image.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f2444] font-display">
            Photo Gallery Media
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Curate campus photographs, athletics moments, laboratory activities, and celebrations.
          </p>
        </div>
        <Button
          id="add-photo-btn"
          variant="gold"
          size="sm"
          onClick={() => setIsFormOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Add New Photo
        </Button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#0f2444] text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Visual Image Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-64 bg-slate-200 rounded-2xl" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-500 font-medium text-sm">No photos found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className="group bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between"
            >
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#0f2444]/90 text-amber-400 text-2xs font-bold uppercase backdrop-blur-xs">
                  {img.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-[#0f2444] text-sm line-clamp-1">{img.title}</h4>
                  {img.description && (
                    <p className="text-2xs text-slate-500 line-clamp-2 mt-1">
                      {img.description}
                    </p>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-2xs text-slate-400">
                    {new Date(img.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => setDeletingItem(img)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete Image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD PHOTO MODAL */}
      {isFormOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsFormOpen(false)}
          title="Add New Gallery Photo"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Photo Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Science Fair Robotic Presentation"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Image Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444] bg-white font-medium"
              >
                <option value="School">School</option>
                <option value="Classrooms">Classrooms</option>
                <option value="Students">Students</option>
                <option value="Events">Events</option>
                <option value="Sports">Sports</option>
                <option value="Activities">Activities</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Direct Image URL *
              </label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Short Description / Caption
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details or caption about the event or activity..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button variant="gold" type="submit" isLoading={isSaving}>
                Add to Gallery
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE MODAL */}
      {deletingItem && (
        <Modal
          isOpen={true}
          onClose={() => setDeletingItem(null)}
          title="Confirm Photo Removal"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold">Are you sure you want to remove this photo?</p>
                <p className="mt-1">
                  "{deletingItem.title}" ({deletingItem.category}) will be deleted from the school gallery.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setDeletingItem(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete Photo
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
