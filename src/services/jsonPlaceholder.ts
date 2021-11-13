import axios from "axios"

export interface User {
    membreId: number
    name: string
    phone: string
    email: string
    website: string
}

interface UserList {
    data?: User[]
    error?: Error
}

interface UserData {
    data?: User
    error?: Error
}

export const getUserList = async (): Promise<UserList> => {
    try {
        const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users`)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}

export const getUserData = async (id: number): Promise<UserData> => {
    try {
        const { data } = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
        return { data }
    } catch (error) {
        return { error: error as Error }
    }
}
