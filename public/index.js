$(function() {

   let bttn = $('#btn')
   $(bttn).click(()=> {
       var name = $('#book').val()

       if (name == '') {
        alert("Type something in the search box")
    }
       else{
        let url=''
        let img = ''
        let author=''
        let title=''

        $.get('https://www.googleapis.com/books/v1/volumes?q=' + name, function(response) {

            for (i=0;i<response.items.length; i++){
                title = $('<h5 class= "center-align black-text">' + response.items[i].volumeInfo.title + '</h5>')
                author = $('<h5 class= "center-align black-text"> By:' + response.items[i].volumeInfo.authors + '</h5>')
                img = $('<img id="dynamic"><br><a href=' + response.items[i].volumeInfo.infoLink + '><button id="imgbtn" class="btn red aligning">Read More</button></a>')
                url = response.items[i].volumeInfo.imageLinks.thumbnail
    
                img.attr('src',url)
                
                title.appendTo("#result")
                author.appendTo("#result")
                img.appendTo("#result")
            }          
       })

    }
       
       
   })
    
  /*  $('#form').submit(()=> {
        var search = $('#book').val()
        if (search == '') {
            alert("Type something in the search box")
        }
        else {
            let url=''
            let img = ''
            let author=''
            let title=''
 
            $.get('/', function(response){
                console.log('Hi')
            })
        }
    })
 
    return false
   */ 

  
})

