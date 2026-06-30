const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID || '';

export const isAdmin = (userId: string | null) => {
    return userId === ADMIN_ID;
};