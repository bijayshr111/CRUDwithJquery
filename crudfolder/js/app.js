$(document).ready(function () {
  let groceryItems = JSON.parse(localStorage.getItem("groceryItems")) || [
    { id: "1", name: "Apple", completed: true },
    { id: "2", name: "Cabbage", completed: true },
    { id: "3", name: "Spinach", completed: false },
  ];

  function saveItems() {
    localStorage.setItem("groceryItems", JSON.stringify(groceryItems));
  }

  function renderItems(items) {
    const $app = $("#app");
    $app.empty();

    if (items.length === 0) {
      $app.append("<p class='empty'>No items left</p>");
      return;
    }

    const $list = $("<ol>").addClass("items");

    items.forEach((item) => {
      const $li = $("<li>").addClass("single-item");

      const $checkbox = $("<input>")
        .attr("type", "checkbox")
        .prop("checked", item.completed)
        .on("change", function () {
          item.completed = $(this).is(":checked");
          saveItems();
          renderItems(groceryItems);
        });

      const $name = $("<span>")
        .text(item.name)
        .css("text-decoration", item.completed ? "line-through" : "none");

      const $editBtn = $("<button>")
        .addClass("btn edit-btn")
        .text("Edit")
        .on("click", function () {
          const $input = $("<input>")
            .attr("type", "text")
            .val(item.name)
            .on("blur keypress", function (e) {
              if (e.type === "blur" || e.key === "Enter") {
                item.name = $(this).val().trim() || item.name;
                saveItems();
                renderItems(groceryItems);
              }
            });
          $name.replaceWith($input);
          $input.focus();
        });

      const $removeBtn = $("<button>")
        .addClass("btn remove-btn")
        .text("Remove")
        .on("click", function () {
          groceryItems = groceryItems.filter((i) => i.id !== item.id);
          saveItems();
          renderItems(groceryItems);
        });

      $li.append($checkbox, $name, $editBtn, $removeBtn);
      $list.append($li);
    });

    $app.append($list);
  }

  // Add new item
  $("#grocery-form").on("submit", function (e) {
    e.preventDefault();
    const inputVal = $("#grocery-input").val().trim();

    if (inputVal) {
      const newItem = {
        id: Date.now().toString(),
        name: inputVal,
        completed: false,
      };
      groceryItems.push(newItem);
      $("#grocery-input").val("");
      saveItems();
      renderItems(groceryItems);
    }
  });

  // Clear all items
  $("#clear-btn").on("click", function () {
    groceryItems = [];
    saveItems();
    renderItems(groceryItems);
  });

  renderItems(groceryItems);
});
