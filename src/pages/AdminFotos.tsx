import { useState, useRef } from "react";
import { Plus, Trash2, Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnniversaryPhotos,
  useUploadPhoto,
  useDeletePhoto,
  PHOTO_CATEGORIES,
  AnniversaryPhoto,
} from "@/hooks/useAnniversaryPhotos";

const CategoryTab = ({ category }: { category: string }) => {
  const { data: photos = [], isLoading } = useAnniversaryPhotos(category);
  const uploadPhoto = useUploadPhoto();
  const deletePhoto = useDeletePhoto();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState("");
  const [photoToDelete, setPhotoToDelete] = useState<AnniversaryPhoto | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      await uploadPhoto.mutateAsync({ file, category, caption: caption || undefined });
    }
    setCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div className="border-2 border-dashed border-border rounded-xl p-6 bg-muted/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div className="space-y-2 flex-1 w-full">
            <Label>Legenda (opcional)</Label>
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Descrição da foto..."
            />
          </div>
          <div className="w-full sm:w-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadPhoto.isPending}
              className="gap-2 w-full sm:w-auto"
            >
              <Upload className="w-4 h-4" />
              {uploadPhoto.isPending ? "Enviando..." : "Enviar Fotos"}
            </Button>
          </div>
        </div>
      </div>

      {/* Photos grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-2">
          <Image className="w-12 h-12 opacity-40" />
          <p>Nenhuma foto nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={photo.photo_url}
                alt={photo.caption || "Foto"}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setPhotoToDelete(photo)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                  {photo.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete dialog */}
      <AlertDialog open={!!photoToDelete} onOpenChange={() => setPhotoToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (photoToDelete) deletePhoto.mutate(photoToDelete);
                setPhotoToDelete(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const AdminFotos = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Galeria de Fotos</h1>
        <p className="text-muted-foreground">
          Gerencie as fotos dos 20 anos de ministério
        </p>
      </div>

      <Tabs defaultValue="sexta" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-lg">
          {PHOTO_CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.value} value={cat.value}>
              {cat.label.replace("Culto de ", "").replace("Companheirismo ", "")}
            </TabsTrigger>
          ))}
        </TabsList>

        {PHOTO_CATEGORIES.map((cat) => (
          <TabsContent key={cat.value} value={cat.value}>
            <h2 className="text-lg font-semibold text-foreground mb-4">{cat.label}</h2>
            <CategoryTab category={cat.value} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AdminFotos;
