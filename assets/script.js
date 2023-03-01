// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(document).ready(function() {

  var planner = [];

  // loads any events stored in localStorage and adds them to the scheduler
  var taskLoader = function() {
    planner = JSON.parse(localStorage.getItem("planner")) || [{ time: "", event: "" }];

    planner = planner.map(function(event) {
      return event || { time: "", event: ""};
    });

    planner.forEach(function(event) {
      addEvent(event.time, event.event);
    });
  }

  var addEvent = function(eventTime, eventContent) {
    var taskNew = $("<p>").addClass("m-2 task-new").text(eventContent);

    $("#hour-" + eventTime).find(".description").append(taskNew); 
  }

  var saveEvent = function() {
    localStorage.setItem("planner", JSON.stringify(planner));
  }

  // event listener to edit event item when clicked
  $(".time-block").on("click", ".description", function() {
      var content = $(this).text().trim();
      var newEntry = $("<textarea>", {
        class: "col-md-10 form-control",
        val: content
      });

      $(this).replaceWith(newEntry);
      newEntry.trigger("focus");
  });

  // function that saves user text input
  $(".saveBtn").on("click", function() {
      var textEntry = $(this).closest(".time-block").find(".form-control");

  // updates the event text
      var contents = textEntry.val().trim();
      var eventTime = $(this).closest(".time-block").attr("id").replace("hour-", "");

      var eventInput = $("<div>", {
        class: "col-md-10 description",
        html: $("<p>", {
          class: "m-2",
          text: contents
        })
      });

      textEntry.replaceWith(eventInput);

  // update the planner array
      var index = $(this).closest(".time-block").index();
      var eventObj = { time: eventTime, event: contents };

      planner[index] = eventObj;
      saveEvent();
      timeAuditor();
    });

  // loops through and updates the class of each time block based on the current time.
    var timeAuditor = function() {
      var now = dayjs();
      var currentHour = now.hour();

      for (i = 9; i < 18; i++) {
        var timeBlockEl = $("#hour-" + i).find(".description");
        timeBlockEl.removeClass("past present future");

        if (currentHour < i) {
          timeBlockEl.addClass("future");
        } else if (currentHour > i) {
          timeBlockEl.addClass("past");
        } else {
          timeBlockEl.addClass("present");
        }
      }
    }

    // reset planner
    $(".reset-btn").on("click", function() {
      localStorage.clear();
      $(".task-new").remove();
    });

    // displays current date and time in the header - dynamically updates via Day.js API
  $("#currentDay").text("The current time is: " + dayjs().format("h:mm A on dddd, MMMM D" + "."));
  setInterval(function() {
    $("#currentDay").text("The current time is: " + dayjs().format("h:mm A on dddd, MMMM D" + "."));
    timeAuditor();
  }, 60000);

  taskLoader();
  timeAuditor();

});