import axios from "axios";

export const getFiles = async (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        axios.get('/api/files').then(response => {
            resolve(response.data.files);
        }).catch(err => {
            reject(err);
        })
    });
}

export const getFileContent = async (filename: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        axios.get(`/api/files/${filename}`).then(response => {
            resolve(response.data.content);
        }).catch(err => {
            reject(err);
        })
    });
}

export const saveFileContent = async (filename: string, content: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.post(`/api/files/${filename}`, { content }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        })
    });
}

export const deleteFile = async (filename: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.delete(`/api/files/${filename}`).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        })
    });
}

export const uploadFile = async (data: FormData): Promise<any> => {
    return new Promise((resolve, reject) => {
        axios.post(`/api/upload`, data, { headers: { "Content-Type": "multipart/form-data" } }).then(response => {
            resolve(response.data);
        }).catch(err => {
            reject(err);
        })
    });
}