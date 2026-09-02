import 'dotenv/config';
import axios from 'axios';

export async function findpx(norm){
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url:`${process.env.API_URL}/api/petugas/pasien/${norm}`,
        headers: {
            'Authorization': process.env.API_KEY
        }
    };
    try {
        const response = await axios.request(config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        return null
    }
}
export function covertUsia(tanggalLahir){
    const birthDate = new Date(tanggalLahir);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Koreksi jika bulan ini sebelum bulan lahir, 
    // atau bulan sama tapi tanggal belum terlewati
    if (months < 0 || (months === 0 && days < 0)) {
        years--;
        months += 12;
    }

    // Koreksi jumlah bulan jika tanggal saat ini lebih kecil dari tanggal lahir
    if (days < 0) {
        months--;
        // Jika bulan menjadi negatif setelah dikurangi
        if (months < 0) {
            months = 11;
            years--;
        }
    }

    // Format output sesuai kondisi
    if (years > 0) {
        return `${years} th`;
    } else if (months > 0) {
        return `${months} bl`;
    } else {
        // Ekstra: Format hari untuk pasien bayi baru lahir (< 1 bulan)
        const diffTime = Math.abs(today - birthDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} hr`;
    }
    
}