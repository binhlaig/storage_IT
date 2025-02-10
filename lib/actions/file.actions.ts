"use server";
import { InputFile } from "node-appwrite/file";
import { CreateAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";
import { Search } from "lucide-react";

interface UploadFileProps {
    file: File;
    ownerId: string;
    accountId: string;
    path: string;
}
const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;

}

export const UploadFile = async ({ file, ownerId, accountId, path }: UploadFileProps) => {
    const { storage, databases } = await CreateAdminClient();

    try {
        const inputFile = InputFile.fromBuffer(file, file.name);

        const bucketFile = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            inputFile,
        );

        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerId,
            accountId,
            users: [],
            bucketId: bucketFile.$id,
        };

        const newFile = await databases
            .createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.filesCollectionId,
                ID.unique(),
                fileDocument,
            )
            .catch(async (error: unknown) => {
                await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
                handleError(error, "Failed to create file document");
            });

        revalidatePath(path);
        return parseStringify(newFile);
    } catch (error) {
        handleError(error, "Failed to upload file");
    }
};

const createQueries = (
    currentUser: Models.Document,
    types: string[],
    searchText: string,
    sort: string,
    limit?: number,) => {

    const queries = [
        Query.or([
            Query.equal('owner', [currentUser.$id]),
            Query.contains("users", [currentUser.email])
        ]),
    ];

    if (types.length > 0) queries.push(Query.equal("type", types));
    if (searchText) queries.push(Query.contains("name", searchText));
    if (limit) queries.push(Query.limit(limit));

    if (sort) {
        const [sortBy, orderBy] = sort.split("-");
        queries.push(
            orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy),
        );
    }

    return queries;

}

export const getFile = async ({
    types = [],
    searchText = "",
    sort = "$createdAt-desc",
    limit,
}: GetFilesProps) => {
    const { databases } = await CreateAdminClient();

    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) throw new Error("Usernot found");

        const queries = createQueries(currentUser, types, searchText, sort, limit);

        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries);
        return parseStringify(files)

    } catch (error) {
        handleError(error, "Failed to get files")
    }
}
export const renameFile = async ({ fileId, name, extension, path }: RenameFileProps) => {

    const { databases } = await CreateAdminClient();

    try {
        const newName = `${name}.${extension}`;
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId, {
            name: newName
        });
        revalidatePath(path);
        return parseStringify(updatedFile);
    } catch (error) {
        handleError(error, "Failed to rename file")

    }
};

export const UpdateFile = async ({ fileId, emails, path }: UpdateFileUsersProps) => {
    const { databases } = await CreateAdminClient();
    try {
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId, {
            users: emails
        });
        revalidatePath(path);
        return parseStringify(updatedFile);
    } catch (error) {
        handleError(error, "Failed Update file")

    }
}

export const DeleteFile = async ({ fileId, bucketId, path }: DeleteFileProps) => {
    const { databases, storage } = await CreateAdminClient();
    try {
        const deletedFile = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId);

        if (deletedFile) {
            await storage.deleteFile(
                appwriteConfig.bucketId, bucketId);
        }
        revalidatePath(path);
        return parseStringify(deletedFile);

    } catch (error) {
        handleError(error, "Failed to delete file")

    }



}