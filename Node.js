const bcrypt = require('bcrypt');

const storedHash = '$2b$10$QwItwjbaCZSSW93Ysxg8tOqL3d7ZkhrO80VZ3zyejlg.Vtu1E8rBq';
const password = 'admin123'; // <-- Try this or whatever you expect the admin password to be

bcrypt.compare(password, storedHash).then(result => {
  console.log('✅ Match?', result); // should print true if correct
});
