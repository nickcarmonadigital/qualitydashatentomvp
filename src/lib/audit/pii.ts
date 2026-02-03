export const maskPII = (text: string): string => {
    if (!text) return text;

    // Mask Emails: j***@domain.com
    const emailRegex = /([a-zA-Z0-9._-]+)(@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    let masked = text.replace(emailRegex, (match, user, domain) => {
        return `${user.substring(0, 1)}***${domain}`;
    });

    // Mask Phone Numbers: (123) ***-7890 or 123-***-7890
    // Simple regex to catch common formats
    const phoneRegex = /(\d{3}[-.\s]?)(\d{3}[-.\s]?)(\d{4})/g;
    masked = masked.replace(phoneRegex, (match, part1, part2, part3) => {
        return `${part1}***-${part3}`;
    });

    return masked;
};

// Recursive function to sanitize objects
export const sanitizeObject = <T>(obj: T): T => {
    if (typeof obj === 'string') return maskPII(obj) as unknown as T;
    if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
            return obj.map(sanitizeObject) as unknown as T;
        }
        const newObj: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                newObj[key] = sanitizeObject((obj as any)[key]);
            }
        }
        return newObj;
    }
    return obj;
};
