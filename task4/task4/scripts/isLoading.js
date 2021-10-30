export const isLoading = value => {
    document
        .querySelectorAll('input, textarea, button')
        .forEach(item => (item.disabled = value));
};
