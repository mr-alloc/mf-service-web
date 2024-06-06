

export const Patterns = {
    Email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    Password: /^(?=.*[0-9a-z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,20}$/,
}

export function validate(target: string, pattern: RegExp): boolean {
    return pattern.test(target)
}

export function divide(a: number, b: number) {
    return (a / b);
}

export function percentage(a: number, b: number) {
    return (a / b) * 100;
}
