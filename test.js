//fetch apiye istek atmamızı saglar
//get: veri almaya yarar
//post: sunucuya veri gondermeye yarar
//put: sunucudaki bir veriyi guncellemeye yarar
//delete: bir veriyi silmeye yarar

// get ornegine yalnızca istedigimizi söyluyoruz
function getUsers(){
    fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((data) => renderUsers(data))
    
    .catch((err)=>console.log(err));
    
    }
    getUsers();
    
    function renderUsers(users) {
        users.forEach((user) => document.write(user.name + "</br>"))

    }