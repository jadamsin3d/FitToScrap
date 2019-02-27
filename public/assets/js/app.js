$(() => {
    $('.scrapperbtn').on("click", () => {
        $.getJSON('/redditposts', data => {
            for (let i = 2; i < data.length; i++) {
                $('.redditdiv').append("<a class='redditbtn' data-id='" + data[i]._id + "' type='button' href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a></br><p noteid='" + data[i]._id + "'>NOTES</p>")
            }
        }).then(() => console.log("addedButtons"))
    })

    $(document).on("click", "p", () => {
        $(".notes").empty();
        let thisID = $(this).attr("noteid");

        $.ajax({
            method: "GET",
            url: "/redditposts/" + thisID
        })
            .then(data => {
                console.log(data);
                $(".notes").append("<h2>" + data.title + "</h2>");
                $(".notes").append("<input id='titleinput' name='title' >");
                $(".notes").append("<textarea id='bodyinput' name='body'></textarea>");
                $(".notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

                if (data.note) {
                    $("#titleinput").val(data.note.title);
                    $("#bodyinput").val(data.note.body);
                }
            })
    });

    $(document).on("click", "#savenote", () => {
        let thisID = $(this).attr("noteid");

        $.ajax({
            method: "POST",
            url: "/redditposts/" + thisID,
            data: {
                title: $('#titleinput').val(),
                body: $('#bodyinput').val()
            }
        })
        .then(data => {
            console.log(data);
            $('#notes').empty();
        })

        $('#titleinput').val("");
        $('#bodyinput').val("");
    })
});