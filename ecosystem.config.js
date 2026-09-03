module.exports = {
    apps: [
        {
            name: "clinical-backend",
            script: "npm",
            args: "--workspace backend run start", // Sesuaikan dengan script start di workspace backend Anda
            env: {
                // NODE_ENV: "production",
            },
        },
        {
            name: "clinical-frontend",
            script: "npm",
            args: "--workspace frontend run start", // Atau sesuaikan jika frontend menggunakan 'next start' / 'vite preview'
            env: {
                // NODE_ENV: "production",
                // PORT: 3000, // Sesuaikan port frontend jika diperlukan
            },
        },
    ],
};