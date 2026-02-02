import { useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import RichTextEditor from "@/components/admin/RichTextEditor";
import {
  useAdminPages,
  useCreatePage,
  useUpdatePage,
  useDeletePage,
  Page,
} from "@/hooks/usePages";

const defaultPage: Omit<Page, "id" | "created_at" | "updated_at"> = {
  title: "",
  slug: "",
  content: "",
  hero_title: "",
  hero_subtitle: "",
  section_subtitle: "",
  section_title: "",
  parent_menu: "",
  menu_order: 0,
  show_in_menu: true,
  published: true,
};

const AdminPaginas = () => {
  const { data: pages = [], isLoading } = useAdminPages();
  const createPage = useCreatePage();
  const updatePage = useUpdatePage();
  const deletePage = useDeletePage();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
  const [formData, setFormData] = useState(defaultPage);

  const handleOpenCreate = () => {
    setEditingPage(null);
    setFormData(defaultPage);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (page: Page) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content || "",
      hero_title: page.hero_title || "",
      hero_subtitle: page.hero_subtitle || "",
      section_subtitle: page.section_subtitle || "",
      section_title: page.section_title || "",
      parent_menu: page.parent_menu || "",
      menu_order: page.menu_order || 0,
      show_in_menu: page.show_in_menu ?? true,
      published: page.published ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (page: Page) => {
    setPageToDelete(page);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-generate slug from title if empty
    const slug = formData.slug || formData.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const pageData = { ...formData, slug };

    if (editingPage) {
      await updatePage.mutateAsync({ id: editingPage.id, ...pageData });
    } else {
      await createPage.mutateAsync(pageData);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (pageToDelete) {
      await deletePage.mutateAsync(pageToDelete.id);
      setIsDeleteDialogOpen(false);
      setPageToDelete(null);
    }
  };

  // Group pages by parent menu
  const groupedPages = pages.reduce((acc, page) => {
    const menu = page.parent_menu || "Sem Menu";
    if (!acc[menu]) acc[menu] = [];
    acc[menu].push(page);
    return acc;
  }, {} as Record<string, Page[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Páginas</h1>
          <p className="text-muted-foreground">
            Gerencie as páginas do site
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Página
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhuma página cadastrada ainda.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedPages).map(([menu, menuPages]) => (
            <div key={menu} className="space-y-4">
              <div className="flex items-center gap-2">
                <Menu className="w-4 h-4 text-muted-foreground" />
                <h2 className="font-semibold text-foreground">{menu}</h2>
                <Badge variant="secondary">{menuPages.length}</Badge>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Ordem</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {menuPages.map((page) => (
                      <TableRow key={page.id}>
                        <TableCell className="font-medium">{page.title}</TableCell>
                        <TableCell className="text-muted-foreground">
                          /pagina/{page.slug}
                        </TableCell>
                        <TableCell>{page.menu_order}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {page.published ? (
                              <Badge variant="default" className="gap-1">
                                <Eye className="w-3 h-3" />
                                Publicada
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <EyeOff className="w-3 h-3" />
                                Rascunho
                              </Badge>
                            )}
                            {page.show_in_menu && (
                              <Badge variant="outline">No Menu</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEdit(page)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDelete(page)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPage ? "Editar Página" : "Nova Página"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Página *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ex: Nossa História"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="Gerado automaticamente do título"
                />
                <p className="text-xs text-muted-foreground">
                  Será acessado em: /pagina/{formData.slug || "..."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parent_menu">Menu Pai</Label>
                <Input
                  id="parent_menu"
                  value={formData.parent_menu || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, parent_menu: e.target.value })
                  }
                  placeholder="Ex: Nossa História"
                />
                <p className="text-xs text-muted-foreground">
                  Agrupa páginas sob um dropdown no menu
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="menu_order">Ordem no Menu</Label>
                <Input
                  id="menu_order"
                  type="number"
                  value={formData.menu_order || 0}
                  onChange={(e) =>
                    setFormData({ ...formData, menu_order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
              <h3 className="font-medium">Cabeçalho da Página (Hero)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero_title">Título do Hero</Label>
                  <Input
                    id="hero_title"
                    value={formData.hero_title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, hero_title: e.target.value })
                    }
                    placeholder="Título principal no topo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero_subtitle">Subtítulo do Hero</Label>
                  <Input
                    id="hero_subtitle"
                    value={formData.hero_subtitle || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, hero_subtitle: e.target.value })
                    }
                    placeholder="Descrição abaixo do título"
                  />
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
              <h3 className="font-medium">Seção de Conteúdo</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="section_subtitle">Subtítulo da Seção</Label>
                  <Input
                    id="section_subtitle"
                    value={formData.section_subtitle || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, section_subtitle: e.target.value })
                    }
                    placeholder="Ex: Nossa Jornada"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section_title">Título da Seção</Label>
                  <Input
                    id="section_title"
                    value={formData.section_title || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, section_title: e.target.value })
                    }
                    placeholder="Ex: Uma História de Fé"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <RichTextEditor
                value={formData.content || ""}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="Escreva o conteúdo da página..."
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="published"
                  checked={formData.published ?? true}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked })
                  }
                />
                <Label htmlFor="published">Publicar página</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="show_in_menu"
                  checked={formData.show_in_menu ?? true}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, show_in_menu: checked })
                  }
                />
                <Label htmlFor="show_in_menu">Mostrar no menu</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createPage.isPending || updatePage.isPending}
              >
                {editingPage ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir página?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a página "{pageToDelete?.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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

export default AdminPaginas;
