
export interface Directory {
    path: string[]
}

export interface File extends Directory {
    name: string
}

export type FileOrDirectory = File | Directory
