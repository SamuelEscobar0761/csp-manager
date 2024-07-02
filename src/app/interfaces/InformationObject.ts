export default interface InformationObject {
    key: string;
    page: string;
    component: string;
    name: string;
    path: string;
    url?: string | null; // La URL es opcional y puede ser null
}
