import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTitle";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnniversaryPhotos, PHOTO_CATEGORIES } from "@/hooks/useAnniversaryPhotos";

const PhotoGrid = ({ category }: { category: string }) => {
  const { data: photos = [], isLoading } = useAnniversaryPhotos(category);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">
        Nenhuma foto disponível ainda.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group cursor-pointer"
            onClick={() => setSelectedPhoto(photo.photo_url)}
          >
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={photo.photo_url}
                alt={photo.caption || "Foto do aniversário"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            {photo.caption && (
              <p className="text-xs text-muted-foreground mt-1.5 truncate">{photo.caption}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
              onClick={() => setSelectedPhoto(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedPhoto}
              alt="Foto ampliada"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const GaleriaFotos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-28 md:pt-32 pb-12 md:pb-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-3">
            Galeria de Fotos
          </h1>
          <p className="font-body text-base md:text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            20 Anos de Ministério — Momentos especiais registrados
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionTitle
            subtitle="Celebração"
            title="Nossos Momentos"
          />

          <Tabs defaultValue="sexta" className="w-full">
            <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-8">
              {PHOTO_CATEGORIES.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value} className="text-xs sm:text-sm">
                  {cat.label.replace("Culto de ", "").replace("Companheirismo ", "")}
                </TabsTrigger>
              ))}
            </TabsList>

            {PHOTO_CATEGORIES.map((cat) => (
              <TabsContent key={cat.value} value={cat.value}>
                <h3 className="text-lg font-semibold text-foreground mb-6">{cat.label}</h3>
                <PhotoGrid category={cat.value} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GaleriaFotos;
