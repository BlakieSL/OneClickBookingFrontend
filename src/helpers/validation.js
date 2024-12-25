export const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
}

export const validatePassword = (value) => {
    const errors = [];

    if(value.length < 8 || value.length > 50) {
        errors.push('Password must be between 8 and 50 characters');
    }

    if(!/[a-z]/.test(value)) {
        errors.push('Password must include at least one lowercase letter');
    }

    if(!/[A-Z]/.test(value)) {
        errors.push('Password must include at least one uppercase letter');
    }

    if(!/\d/.test(value)) {
        errors.push('Password must include at least one digit');
    }

    if(!/.*[^a-zA-Z0-9].*/.test(value)) {
        errors.push('Password must include at least one special character');
    }

    return errors.length > 0 ? errors : null;
}