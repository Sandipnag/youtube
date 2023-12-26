import fs from 'fs';
const folderPath = './public/temp';


export const deleteAllfiles = (path = folderPath) => {
    fs.readdir(path, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }
        files.forEach(file => {
            const filePath = `${path}/${file}`;

            fs.unlink(filePath, err => {
                if (err) {
                    console.error('Error deleting file:', err);
                    return;
                }
                console.log(`${file} has been deleted successfully.`);
            });
        });
    });
}