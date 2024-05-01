export default interface Image {
    page: string;
    component: string;
    name: string;
    path: string;
    url?: string | null; // La URL es opcional y puede ser null
    title?: string | null;
    date?: string | null;
    description?: string | null;
}
