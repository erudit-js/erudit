import gradient from 'gradient-string';

export const brandLogotype = `
███████╗██████╗ ██╗   ██╗██████╗ ██╗████████╗
██╔════╝██╔══██╗██║   ██║██╔══██╗██║╚══██╔══╝
█████╗  ██████╔╝██║   ██║██║  ██║██║   ██║
██╔══╝  ██╔══██╗██║   ██║██║  ██║██║   ██║
███████╗██║  ██║╚██████╔╝██████╔╝██║   ██║
╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝   ╚═╝
`;

export const brandTitle = 'Erudit';
export const brandColors = ['#6fa552', '#4475bc'];
export const brandColorLogotype =
    gradient(brandColors).multiline(brandLogotype);
export const brandColorTitle = gradient(brandColors)(brandTitle);
