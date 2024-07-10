export default interface NewsObject {
    key: string;
    date: string;
    description: string;
    image: string;
    title: string;
    url: string | null; // La URL es opcional y puede ser null
}
