export declare class CreatePostDto {
    title: string;
    content: string;
    status: boolean;
    tags?: string;
    category: string;
}
export declare class UpdatePostDto {
    title?: string;
    content?: string;
    image?: string;
    status?: boolean;
    tags?: string;
}
