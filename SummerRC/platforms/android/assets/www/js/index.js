// Global Variables
var jsonData = null;
var totalChapters = 0;
var totalQuestions = -1;
var chapterID = -1;
var questionID = -1;
var siteID = -1;
var answerID = -1;
var currentScore = 0;
var contextGrp = null;
var contextGrp2 = null;
var keyGrpLen = 0;
var ansKey = [];
var ans2Key = [];
var correctAns = -1;
var selectedAnswer = -1;
var queFormat = -1;
var jsonObj = [];
var boolCheck = 0;
var stuAns1 = null;
var stuAns2 = null;
var text_value = null;
var loop2 = 0;
var subQuest = null;
var varScore = 0;
var varScore2 = 0;
var storage = window.localStorage;
var visitChap = 0;
var loop2 = 0;
var email = null;
var correctAnsArr = [];
var selectedAnsArr = [];
var searchChapFlag = 0;
var search_text = null;
var path = null;
var ItemSchema = ContentModel.schema;

var socket = io.connect('http://ec2-52-87-183-35.compute-1.amazonaws.com:9000');

//Initializing newScore data element (captures the data for each item)
var newScore = {
    email: null,
    questionId: null,
    contextGrp1: null,
    score1: null,
    studentResponse1: null,
    contextGrp2: null,
    score2: null,
    studentResponse2: null
};

function onLoad() {
    $.mobile.allowCrossDomainPages = true;
    $.support.cors = true;
    document.addEventListener("deviceready", onDeviceReady, false);
}


function onDeviceReady() {
    //document.addEventListener('backbutton', onBack, false);
    //document.addEventListener("pause", onPause, false);
    //document.addEventListener("resume", onResume, false);
    console.log("entering onDeviceReady");
    FastClick.attach(document.body);

    $("#home_page").on('touchmove', function (ev) {
        ev.preventfault();
    });

    // Disable touch scrolling on the questions page
    $("#questions_page").on('touchmove', function (ev) {
        ev.preventDefault();
    });
    // AJAX call to get JSON data containing the chapters and question	
    path = window.location.href.replace('index.html', '');
    $.ajax({
     //      url: path + "sample.json",
        url: "http://e-ccss.com/RioELA.json",
        dataType: "json",
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        }
    }).done(ajaxSuccess).fail(ajaxError);
}

function onPause() {
    console.log("on pause");
}

function onResume() {
    console.log("on resume");
}

function onBack() {
    console.log("on back");
}


function ajaxSuccess(data) {
    // Save the json data returned to the jsonData global variable
    jsonData = data;
    // Bind event listener to the start button if the JSON data is successfully saved
    if (jsonData != null) {
        $("#Log_in_btn").on('click', validateEmail);
        $("#start_btn").on('click', addAllChapters);
    }
}


function ajaxError(error) {
    alert("Failed to get the chapters data");
}


function addAllChapters() {
    if (visitChap == 0 || searchChapFlag == 1) {
        // Reset all chapters in the list
        if ($("#chapters").children().length > 0) {
            $("#chapters li").remove();
            $("#chapters table").remove();
            $("#chapters input").remove();
        }
        // Get the total chapters from the chapters array and assign it to totalChapters global variable
        totalChapters = jsonData.test.length;
        loop2 = 0;
        jsonObj = [];
        $("#chapters").append("<table style='width:100%'><tr><td><input name='searchTxt' type='text'/></td><td style='text-align : center; width:4em'><a id='searchChapter'><img id ='search' src='/images/search.png'/></a></td></tr></table>");
        for (var i = 0; i < totalChapters; i++) {
            var chapter = "<li><a href='#sites_page' class='chapter' id='" + i + "' data-transition='flip'>" + jsonData.test[i].topicId + "</a></li>";
            // Append each chapter to the chapters list
            $("#chapters").append(chapter);
        }
        if (!search_text ) {
            searchChapFlag = 0;
        }
        // Attach click event listener to all added chapters
        $("#chapters li a.chapter").on('click', addAllSites);
    }

    $(document).on("click", "#searchChapter", function () {
        search_text = $('input:text[name=searchTxt]').val();
        console.log("search value is " + search_text);
        searchChapFlag = 1;
        if ($("#chapters").children().length > 0) {
            $("#chapters li").remove();
        }
        for (var i = 0; i < totalChapters; i++) {
            if (jsonData.test[i].topicId.indexOf(search_text) < 0) {
                continue;
            } else {
                var chapter = "<li><a href='#sites_page' class='chapter' id='" + i + "' data-transition='flip'>" + jsonData.test[i].topicId + "</a></li>";
            }
            // Append each chapter to the chapters list
            $("#chapters").append(chapter);
            $("#chapters li a.chapter").on('click', addAllSites);
            $("#chapters").listview().listview('refresh');
        }
    });
    search_text = "";
   
    // Refresh the listview widget
    $("#chapters").listview().listview('refresh');
}


function addAllSites(ev) {
    document.addEventListener('backbutton', onBack, false);
    console.log("entering addAllSites");
    $("#chapter").html(ev.currentTarget.innerHTML);
    if ($("#sites").children().length > 0) {
        $("#sites li").remove();
    }
    $("#sites").empty();

    ChapterID = $(this).attr('id');
    siteID = $(this).attr('id');

    // Get the total answers for the selected question
    totalSites = jsonData.test[siteID].links.length;

    for (var i = 0; i < totalSites; i++) {
        var label = document.createElement('label');
        desc = jsonData.test[siteID].links[i].description;
        label.textContent = desc;
        $("#sites").append(label);
        $("#sites").append('<br>');
        // Create a new list item containing each answers
        var ste = "<li><a href='#' onclick=\"cordova.InAppBrowser.open('" + jsonData.test[siteID].links[i].linkY + "', '_blank');\">" + jsonData.test[siteID].links[i].linkY + "</a></li>";
        // Append each answer to the answers list
        $("#sites").append(ste);
        $("#sites").append('<br>');
        $("#sites").append('<br>');
    }

    $("#sites").listview().listview('refresh');
    $("#showQuestions").on('click', addAllQuestions);

}

function openUrl(url) {
    document.addEventListener('backbutton', onBack, false);
    console.log("entering openUrl " + url);
    $("#contentN").empty();
    console.log("1 " + url);
    //  var ste = "<li><a href='#' onclick=\"window.open("+url+", '_self', 'location=yes');\">" + url + "</a></li>";
    //var ste =
    console.log("2 " + url);
    // Append each answer to the answers list
    //$("#contentN").append(ste);
    console.log("3 " + url);
    var windowSize = "width=" + window.innerWidth + ",height=" + window.innerHeight + ",scrollbars=no";
    window.open(url, '_blank', 'location=yes', 'popup', windowSize);
  //  window.location.href = url;
    $("#contentN").listview().listview('refresh');
    console.log("4 " + url);
  //  $("#content").append("window.open(" + url + ", '_self')");
   // window.open(url, '_blank', 'location=yes');
}



function addAllQuestions(ev) {
    $("#questions").html(ev.currentTarget.innerHTML);
    // Change the chapter title inside the <p> element
    // Reset all questions in the list
    if ($("#questions").children().length > 0) {
        $("#questions li").remove();
    }

    $("#questions").empty();

    questionID = $(this).attr('id');
 //   alert("initilly it is " + questionID);

    // Get the total answers for the selected question
    totalQuestions = jsonData.test[siteID].questions.length;

    for (var i = 0; i < totalQuestions; i++) {
        // Create a new list item containing each answers
        var answer = "<li data-icon='false'><a href='#answers_page' class='answer' id='" + i + "' data-transition='flip'>" + jsonData.test[siteID].questions[i].question + "</a></li>";

        // Append each answer to the answers list
        $("#questions").append(answer);
    }

    // Attach click event listener to all added questions
    $("#questions li a.answer").on('click', addAllAnswers);

    // Refresh the listview widget
    $("#questions").listview().listview('refresh');
}

function addAllAnswers(ev) {
    boolCheck = 0;
    answerID = $(this).attr('id');
    questionID = $(this).attr('id');
    $("#answer1").html(ev.currentTarget.innerHTML);
    $("#answers_page h1 #MyHeaderID").text("Question: #" + (parseInt(answerID, 10) + 1) + " of " + totalQuestions);

    // Reset all questions in the list
    if ($("#answers").children().length > 0) {
        $("#answers li").remove();
    }
    $("#answers").empty();
    queFormat = jsonData.test[siteID].questions[answerID].questionFormat;
    correctAns = jsonData.test[siteID].questions[answerID].answerId;
    contextGrp = jsonData.test[siteID].questions[answerID].contextGroup1;
    if (queFormat == 2 || queFormat == 3 || queFormat == 4 || queFormat == 5 || queFormat == 8 || queFormat == 7) {
        keyGrpLen = jsonData.test[siteID].questions[answerID].keys1.length;
        for (var j = 0; j < keyGrpLen; j++) {
            ansKey[j] = jsonData.test[siteID].questions[answerID].keys1[j];
        }
    }

    if (queFormat == 1 || queFormat == 2 || queFormat == 8) {
        var totalAnswers = jsonData.test[siteID].questions[answerID].answers.length;
        for (var i = 0; i < totalAnswers; i++) {
            var answer1 = "<li data-icon='false'><a href='#answers_page' class='answer1' id='" + i + "' data-answer='" + correctAns + "' >" + jsonData.test[siteID].questions[answerID].answers[i] + "</a></li>";
            $("#answers").append(answer1);
        }

        if (queFormat == 2 || queFormat == 8) {
            contextGrp2 = jsonData.test[siteID].questions[answerID].contextGroup2;
            $("#answers textarea").remove();
            $("#answers").append('<br>');
            var label = document.createElement('label');
            subQuest = "Please enter the first 3 words of the sentence that shows your answer is correct.";
            label.textContent = "Please enter the first 3 words of the sentence that shows your answer is correct.";
            $("#answers").append(label);
            var input = '<textarea id="sub1" name="sub1"></textarea>';
            $("#answers").append(input);
        }
    } else if (queFormat == 3 || queFormat == 5) {
        $("#answers textarea").remove();
        var input = '<textarea id="sub1" name="sub1"></textarea>';
        $("#answers").append(input);
    } else if (queFormat == 4 || queFormat == 7) {
        contextGrp2 = jsonData.test[siteID].questions[answerID].contextGroup2;
        $("#answers textarea").remove();
        var input = '<textarea id="sub1" name="sub1"></textarea>';
        $("#answers").append(input);
        $("#answers").append('<br>');
        $("#answers").append('<br>');
        subQuest = jsonData.test[siteID].questions[answerID].subQuestion;
        $("#answers").append(subQuest);
        var key2GrpLen = jsonData.test[siteID].questions[answerID].keys2.length;
        for (var k = 0; k < key2GrpLen; k++) {
            ans2Key[k] = jsonData.test[siteID].questions[answerID].keys2[k];
        }
        var input1 = '<textarea id="sub2" name="sub2"></textarea>';
        $("#answers").append(input1);
    } else if (queFormat == 6) {
        $("#answers div").remove();
        correctAnsArr = [];
        selectedAnsArr = [];
        var totalAnswers = jsonData.test[siteID].questions[answerID].answers.length;
        var totalCorAnswers = jsonData.test[siteID].questions[answerID].answerId.length;
        console.log("totalAnswers =" + totalAnswers + " totalCorAnswers=" + totalCorAnswers);
        for (var j = 0; j < totalCorAnswers; j++) {
            correctAnsArr.push(jsonData.test[siteID].questions[answerID].answerId[j]);
        }
        $("#answers").append('<div id="chkBox">');
        for (var i = 0; i < totalAnswers; i++) {
            var label = $('<label>' + jsonData.test[siteID].questions[answerID].answers[i] + '<input type="checkbox" name="chkBox" class="chkBox" id="chkBox" value="' + i + '"/>' + '</label>');
            $("#answers").append(label);
        }
        $("#answers").append('</div>');
    } else if (queFormat == 9) {
        $("#answers").append('<a id="recRec"><div style="text-align : center;"><img id ="recImg" src="/images/neutralMic.png" class="center"/></div></a>');
    } else if (queFormat == 10) {
        $("#answers").append('<a id="takephoto"><div style="text-align : center;"><img id ="picImg" src="/images/neutralCam.png"/></div></a>');
        $("#answers").append('</br><input type="button" value="Pick" id="pick" /></br>');
    }
    $("#answers li a.answer1").on('click', testClick);
    afterAnswer();
    $("#answers").listview().listview('refresh');


}

function testClick() {
    selectedAnswer = $(this).attr('id');
}

function checkOption() {
    if (selectedAnswer == correctAns) {
        varScore = 1;
    }
}

function checkOptionsMulti() {
    if (!selectedAnsArr.length == correctAnsArr.length) {
        varScore = 0;
    } else {
        varScore = 1;
        for (var j = 0; j < selectedAnsArr.length; j++) {
            if (correctAnsArr.indexOf(selectedAnsArr[j]) < 0) {
                varScore = 0;
            }
        }
    }
}

function checkTextn(textName, ansArr) {
    varScore2 = 0;
    console.log("input is textName");
    text_value = $('textarea#' + textName).val();
    for (var k = 0; k < ansArr.length; k++) {
        console.log(text_value.toLowerCase() + " " + ansArr[k].toLowerCase() + " " + text_value.toLowerCase().indexOf(ansArr[k].toLowerCase()));
        if (text_value.toLowerCase().indexOf(ansArr[k].toLowerCase()) > 0 || text_value.toLowerCase().indexOf(ansArr[k].toLowerCase()) == 0) {
            varScore2 = 1;
        }
    }
}

function checkTextnAnd(textName, ansArr) {
    text_value = $('textarea#' + textName).val();
    for (var k = 0; k < ansArr.length; k++) {
        res = ansArr[k].split(",");
        checkTextn(textName, res);
        if (varScore2 == 0) {
            break;
        }
    }
}

function defaultScore() {
    varScore = 1;
    varScore2 = 1;
}


function checkAnswer() {
    varScore = 0;
    varScore2 = 0;
    console.log('In check answer function.');
    switch (queFormat) {
        case "1":
            checkOption();
            break;
        case "2":
            checkOption();
            checkTextn("sub1", ansKey);
            stuAns2 = text_value;
            break;
        case "3":
            checkTextn("sub1", ansKey);
            if (varScore2 == 1) {
                varScore = 1;
                varScore2 = 0;
            }
            stuAns1 = text_value;
            break;
        case "4":
            checkTextn("sub1", ansKey);
            stuAns1 = text_value;
            if (varScore2 == 1) {
                varScore = 1;
                varScore2 = 0;
            }
            checkTextn("sub2", ans2Key);
            stuAns2 = text_value;
            break;
        case "5":
            checkTextnAnd("sub1", ansKey);
            stuAns1 = text_value;
            if (varScore2 == 1) {
                varScore = 1;
                varScore2 = 0;
            }
            break;
        case "6":
            checkOptionsMulti();
            break;
        case "7":
            checkTextnAnd("sub1", ansKey);
            stuAns1 = text_value;
            if (varScore2 == 1) {
                varScore = 1;
                varScore2 = 0;
            }
            checkTextn("sub2", ans2Key);
            stuAns2 = text_value;
            break;
        case "8":
            checkOption();
            checkTextnAnd("sub1", ansKey);
            stuAns2 = text_value;
            break;
        case "9":
            defaultScore();
            break;
        case "10":
            defaultScore();
            break;
    }
  
    createJSON(varScore, varScore2);
    createNewScore(varScore, varScore2);
}

function afterAnswer() {
    $("#pick").click(function () {
        pick();
    });
    $("#takephoto").click(function () {
        memType = "pic";
        memDate = new Date();
        memId = memDate.toString();

        navigator.device.capture.captureImage(captureSuccess, captureError, { limit: 1 });
    });
    $("#recRec").click(function () {
        memType = "aud";
        memDate = new Date();
        memId = memDate.toString();
        var options = { limit: 1, duration: 10 };
        alert("working till here");
        navigator.device.capture.captureAudio(captureSuccess, captureError, options);
    });
    if (loop2 == 0) {
        $('.showNxtPage').on('click', nextQuestion);
    }
    $(function () {
        $('input[type="checkbox"]').bind('click', function () {
            if ($(this).is(':checked')) {
                selectedAnsArr.push($(this).val());
            }
        });
    });
}


function nextQuestion(ev) {
    loop2 = loop2 + 1;
    if (boolCheck == 0) {
        checkAnswer();
    }

    if (totalQuestions == -1) {
        totalQuestions = jsonData.test[siteID].questions.length;
    }

    if (parseInt(answerID, 10) == (parseInt(totalQuestions, 10) - 1)) {
        boolCheck = 1;
        visitChap = 1;
        totalQuestions = -1;
        jsonObj = [];
        $("#chapters li a#" + ChapterID).addClass('dark');
        event.preventDefault();
        addAllChapters();
        //Call function to send data here on 7/6/16 (chapter end, now question end)
        $(":mobile-pagecontainer").pagecontainer('change', '#chapters_page', {
            transition: "flip",
            reverse: true
        });
    } else {
        boolCheck = 0;
        answerID = parseInt(answerID, 10) + 1;
        ansKey = [];
        $("#answer2").html(jsonData.test[siteID].questions[answerID].question);
        $("#next_answers_page h1 #MyHeaderID").text("Question: #" + (parseInt(answerID, 10) + 1) + " of " + totalQuestions);
        $("#answers_next").empty();
        queFormat = jsonData.test[siteID].questions[answerID].questionFormat;

        // Get the correct answer of the selected question
        correctAns = jsonData.test[siteID].questions[answerID].answerId;
        contextGrp = jsonData.test[siteID].questions[answerID].contextGroup1;

        if (queFormat == 2 || queFormat == 3 || queFormat == 4 || queFormat == 5 || queFormat == 8 || queFormat == 7) {
            keyGrpLen = jsonData.test[siteID].questions[answerID].keys1.length;
            for (var j = 0; j < keyGrpLen; j++) {
                ansKey[j] = jsonData.test[siteID].questions[answerID].keys1[j];
            }
        }

        if (queFormat == 1 || queFormat == 2 || queFormat == 8) {
            var totalAnswers = jsonData.test[siteID].questions[answerID].answers.length;
            for (var i = 0; i < totalAnswers; i++) {
                var answer2 = "<li data-icon='false'><a href='#next_answers_page' class='answer2 ' id='" + i + "' data-answer='" + correctAns + "' >" + jsonData.test[siteID].questions[answerID].answers[i] + "</a></li>";
                $("#answers_next").append(answer2);
            }

            if (queFormat == 2 || queFormat == 8) {
                contextGrp2 = jsonData.test[siteID].questions[answerID].contextGroup2;
                $("#answers_next textarea").remove();
                $("#answers_next").append('<br>');
                var label = document.createElement('label');
                subQuest = "Please enter the first 3 words of the sentence that shows your answer is correct.";
                label.textContent = "Please enter the first 3 words of the sentence that shows your answer is correct.";
                $("#answers_next").append(label);
                var input = '<textarea id="sub1" name="sub1"></textarea>';
                $("#answers_next").append(input);
            }
        } else if (queFormat == 3 || queFormat == 5) {
            $("#answers_next textarea").remove();
            var input = '<textarea id="sub1" name="sub1"></textarea>';
            $("#answers_next").append(input);
        } else if (queFormat == 4 || queFormat == 7) {
            contextGrp2 = jsonData.test[siteID].questions[answerID].contextGroup2;
            $("#answers_next textarea").remove();
            var input = '<textarea id="sub1" name="sub1"></textarea>';
            $("#answers_next").append(input);
            $("#answers_next").append('<br>');
            $("#answers_next").append('<br>');
            subQuest = jsonData.test[siteID].questions[answerID].subQuestion;
            $("#answers_next").append(subQuest);
            var key2GrpLen = jsonData.test[siteID].questions[answerID].keys2.length;
            for (var k = 0; k < key2GrpLen; k++) {
                ans2Key[k] = jsonData.test[siteID].questions[answerID].keys2[k];
            }
            var input1 = '<textarea id="sub2" name="sub2"></textarea>';
            $("#answers_next").append(input1);
        } else if (queFormat == 6) {
            $("#answers_next div").remove();
            correctAnsArr = [];
            selectedAnsArr = [];
            var totalAnswers = jsonData.test[siteID].questions[answerID].answers.length;
            var totalCorAnswers = jsonData.test[siteID].questions[answerID].answerId.length;
            console.log("totalAnswers =" + totalAnswers + " totalCorAnswers=" + totalCorAnswers);
            for (var j = 0; j < totalCorAnswers; j++) {
                correctAnsArr.push(jsonData.test[siteID].questions[answerID].answerId[j]);
            }
            $("#answers_next").append('<div id="chkBox">');
            for (var i = 0; i < totalAnswers; i++) {
                var label = $('<label>' + jsonData.test[siteID].questions[answerID].answers[i] + '<input type="checkbox" name="chkBox" class="chkBox" id="chkBox" value="' + i + '"/>' + '</label>');
                $("#answers_next").append(label);
            }
            $("#answers_next").append('</div>');
        } else if (queFormat == 9) {
            $("#answers").append('<a id="recRec"><div style="text-align : center;"><img id ="recImg" src="/images/neutralMic.png" class="center"/></div></a>');
        } else if (queFormat == 10) {
            $("#answers").append('<a id="takephoto"><div style="text-align : center;"><img id ="picImg" src="/images/neutralCam.png"/></div></a>');
            $("#answers").append('</br><input type="button" value="Pick" id="pick" /></br>');
        }
   
        $("#answers_next li a.answer2").on('click', testClick);
        afterAnswer();
        $("#answers_next").listview().listview('refresh');
    }
}

function createNewScore(varScore, varScore2) {
    item = {}
    item["email"] = email;
    var questionId = jsonData.test[siteID].questions[answerID].queId;
    item["contextGrp1"] = contextGrp;
    item["questionId"] = questionId;
    var currentTime = $.now();

    item["score1"] = varScore;
    if (queFormat == 1 || queFormat == 2) {
        var stuAnswer = jsonData.test[siteID].questions[answerID].answers[selectedAnswer];
        item["studentResponse1"] = stuAnswer;
    } else {
        item["studentResponse1"] = stuAns1;
    }

    if (queFormat == 2 || queFormat == 4) {
        item["contextGrp2"] = contextGrp2;
        item["score2"] = varScore2;
        item["studentResponse2"] = stuAns2;
    }
    console.log('almost emitting');
    //socket.on('new score', function (data) {
        //Instead of sending data for each item.
    newScore = {
        email: email,
        questionId: questionID,
        contextGrp1: contextGrp,
        score1: varScore,
        studentResponse1: stuAnswer,
        contextGrp2: contextGrp2,
        score2: varScore2,
        studentResponse2: stuAns2,
        createDate: new Date,
        updateAt: new Date
    };
    socket.emit('new Score', newScore);
    console.log(newScore);
        console.log('past emitting');
    //});
}

function createJSON(varScore, varScore2) {
    jsonObj = [];
    item = {}
    item["email"] = email;
    var questionId = jsonData.test[siteID].questions[answerID].queId;
    item["contextGrp1"] = contextGrp;
    item["questionId"] = questionId;
 //   item["timestamp"] = $.now();

    item["score1"] = varScore;
    if (queFormat == 1 || queFormat == 2) {
        var stuAnswer = jsonData.test[siteID].questions[answerID].answers[selectedAnswer];
        item["studentResponse1"] = stuAnswer;
    } else if (queFormat == 6) {
        var strResp = "";
        for (var j = 0; j < selectedAnsArr.length; j++) {
            strResp = jsonData.test[siteID].questions[answerID].answers[selectedAnsArr[j]] + " ";
        }
        item["studentResponse1"] = strResp;
    } else {
        item["studentResponse1"] = stuAns1;
    }

    if (queFormat == 2 || queFormat == 4) {
        item["contextGrp2"] = contextGrp2;
        item["score2"] = varScore2;
        item["studentResponse2"] = stuAns2;
    }
    jsonObj.push(item);

    jsonString = JSON.stringify(jsonObj)
    console.log(jsonString);
    storage.setItem("Student", jsonString);
}

//Scoring functions were here 7/6/16
//Client-side code to upload data
try {
    var server = io.connect('');
} catch (e) {
    alert('Sorry, we could not connect. Please try again later \n\n' + e);
}

//Not sure this is complete. Will look at yik yak clone
if (server !== undefined) {
    server.emit('score-connection', sessionStorage.getItem('jsonString'));
    //Creating new scores object
    var newScores = Scores({
    });
    newScores.save(function (err) {
        if (err) throw err;

        console.log("scoresSaved")
    })
};

function validateEmail() {
    email = $('input:text[name=email]').val();
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email)) {
    } else {
        $("#home1").css('color', 'red');
        $("#home1").html("Invalid email");
        event.preventDefault();
    }  
}

var captureSuccess = function (mediaFiles) {
    var i, path, len;
    for (i = 0, len = mediaFiles.length; i < len; i += 1) {
        path = mediaFiles[i].fullPath;

        //alert("path: "+path);
        memTempObj = { 'memId': memId, 'memAdress': path, 'memDate': memDate, 'memType': memType };

        $("#my_image").attr("src", mediaFiles[i].fullPath);

        memArray[memArray.length] = jQuery.extend({}, memTempObj);
        alert("memArray: just added" + memArray.length);
        jsonObj.setItem("memArray", JSON.stringify(memArray));
        showView();

    }
};

// capture error callback
var captureError = function (error) {
    alert("error");
    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
};

function pick() {
    navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.DATA_URL, sourceType: Camera.PictureSourceType.PHOTOLIBRARY });

    function onSuccess(imageData) { var image = document.getElementById('myImage'); image.src = "data:image/jpeg;base64," + imageData; }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

