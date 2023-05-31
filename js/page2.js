$(document).ready(function () {
    $(".list-food").empty();

    const listFood = [];
    const listFoodsDB = [];
    const listRandom = [];

    $.ajax({
        url: 'https://kltn-refrigeratorapp.onrender.com/RecommendSurvey?action=1',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            for (item of data) {
                listFoodsDB.push(item);
                listRandom.push(item);
            }
        },
        error: function (jqxhr, textStatus, error) {
            // Handle errors here
            console.log("Error call API: " + error);
        }
    });

    function addRandomItem() {
        if (listRandom.length != 0) {
            var randomNum = Math.floor(Math.random() * (listRandom.length - 1 + 1) + 0);
            var foodItem = listRandom[randomNum];
            listFood.push(foodItem);
            listRandom.splice(randomNum, 1);
            renderListFood();
        } else {
            console.log("List random empty");
        }
    }

    function renderListFood() {
        $(".list-food").empty();
        for (let item of listFood) {
            var htmlContent = '<div class="card-container">' +
                '<div class="card">' +
                '<span class="remove-icon">x</span>' +
                '<img src="' + item.ingredient_image + '" alt="' + item.ingredient_name + '">' +
                '<div class="intro">' +
                '<h2>' + item.ingredient_name + '</h2>' +
                '</div>' +
                '</div>' +
                '<div class="count">' +
                '<span class="sub">-</span>' +
                '<input type="text" value="' + item.ingredient_amount + '">' +
                '<p>(' + item.ingredient_unit + ')</p>' +
                '<span class="add">+</span>' +
                '</div>' +
                '</div>';

            var newElement = $(htmlContent);
            newElement.find('.remove-icon').on('click', function () {
                removeFromListFood(item.ingredient_name);
            })
            newElement.find('.sub').on('click', function () {
                var inputField = $(this).siblings('input');
                var currentValue = parseInt(inputField.val());
                if (!isNaN(currentValue)) {
                    item.ingredient_amount = currentValue - 1;
                    inputField.val(item.ingredient_amount);
                }
            });
            newElement.find('.add').on('click', function () {
                var inputField = $(this).siblings('input');
                var currentValue = parseInt(inputField.val());
                if (!isNaN(currentValue)) {
                    item.ingredient_amount = currentValue + 1;
                    inputField.val(item.ingredient_amount);
                }
            });

            $(".list-food").append(newElement);
        }
    }

    $("#random").on("click", function () {
        addRandomItem();
    })

    $("#remove-all").on("click", function () {
        $(".list-food").empty();
        for (item of listFood) {
            listRandom.push(item);
        }
        listFood.splice(0, listFood.length);
    })

    const dialog = document.querySelector(".modal");
    $('#pick-db').on("click", function () {
        $(".modal").append("<h2>Please pick some food from below list</h2>");
        for (let item of listFoodsDB) {
            var htmlContent = '<div class="item">' +
                '<img src="' + item.ingredient_image + '" alt="' + item.ingredient_name + '">' +
                '<h4>' + item.ingredient_name + '</h4>';
            if (listRandom.includes(item)) {
                htmlContent += '<input type="checkbox" name="" id=""></div>'
            } else {
                htmlContent += '<input type="checkbox" checked name="" id=""></div>'
            }
            var newElement = $(htmlContent);
            $(".modal").append(newElement);

            newElement.find('input[type="checkbox"]').on('change', function () {
                if ($(this).is(':checked')) {
                    // Checkbox is checked
                    addToListFood(item.ingredient_name);
                    console.log(item);
                } else {
                    // Checkbox is unchecked
                    removeFromListFood(item.ingredient_name);
                    console.log("Checkbox unchecked!");
                }
            });
        }
        var buttonHtml = '<button>OK</button>';
        $(".modal").append($(buttonHtml));
        dialog.showModal();
    })

    dialog.addEventListener("click", e => {
        const dialogDimensions = dialog.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            dialog.close();
            $(".modal").empty();
        }
    })

    function addToListFood(nameOfFood) {
        var foundItem = listFoodsDB.find((obj) => {
            return obj.ingredient_name === nameOfFood;
        })
        listFood.push(foundItem);
        var index = listRandom.findIndex((obj) => {
            return obj.ingredient_name === nameOfFood;
        })
        if (index !== -1) {
            listRandom.splice(index, 1);
        }
        renderListFood();
    }

    function removeFromListFood(nameOfFood) {
        var foundItem = listFoodsDB.find((obj) => {
            return obj.ingredient_name === nameOfFood;
        })
        listRandom.push(foundItem);
        var index = listFood.findIndex((obj) => {
            return obj.ingredient_name === nameOfFood;
        })
        if (index !== -1) {
            listFood.splice(index, 1);
        }
        renderListFood();
    }

    //Handle click event of continue button
    const dialogDishes = document.querySelector(".modal-dishes");
    var listDishes = [];
    $("#continue").on('click', function () {
        $(".dishes-content").empty();
        var data = listFood.map((item) => {
            return {
                id: item.id,
                ingredient_amount: item.ingredient_amount,
                ingredient_unit: item.ingredient_unit
            }
        })
        console.log(data);
        getDataOfDished(data);
        dialogDishes.showModal();
    });

    dialogDishes.addEventListener("click", e => {
        const dialogDimensions = dialogDishes.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            dialogDishes.close();
            listDishes.splice(0, listDishes.length);
            listDishID.splice(0, listDishID.length);
        }
    })

    function getDataOfDished(listFood) {
        listDishes.splice(0, listDishes.length);
        $.ajax({
            url: 'https://kltn-refrigeratorapp.onrender.com/RecommendSurvey?action=2',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(listFood),
            success: function (data) {
                listDishes = [...data];
                // listDishes = listDishes.filter((obj, index) => {
                //     const currentIndex = listDishes.findIndex(item => {
                //         return item.id === obj.id && item.dish_name === obj.dish_name && item.dish_image === obj.dish_image;
                //     })
                //     return index === currentIndex;
                // })
                // console.log(listDishes);
                renderListDishes(listDishes);
            },
            error: function (jqxhr, textStatus, error) {
                // Handle errors here
                console.log("Error call API: " + error);
            }
        });
    }

    var listDishID = [];
    function renderListDishes(listDishes) {

        for (let item of listDishes) {
            var htmlContent = '<div class="card-dishes">' +
                '<span><input type="checkbox"></span>' +
                '<img src="' + item.dish_image + '" alt="' + item.dish_name + '">' +
                '<div class="intro">' +
                '<h3>' + item.dish_name + '</h3>' +
                ' </div>' +
                '</div>';

            var newElement = $(htmlContent);
            let checkBox = newElement.find('input[type="checkbox"]');
            checkBox.on('change', function () {
                if ($(this).is(':checked')) {
                    // Checkbox is checked
                    listDishID = listDishID.filter((element) => {
                        return element !== item.id;
                    })
                    listDishID.push(item.id);
                    console.log(listDishID);

                } else {
                    // Checkbox is unchecked

                    listDishID = listDishID.filter((element) => element !== item.id);
                    console.log(listDishID);
                }
            });
            $(".dishes-content").append(newElement);
        }
    }

    const dialogResult = document.querySelector('.modal-result');

    $('#result').on('click', function () {
        dialogDishes.close();
        callAPIGetResultDishes(listDishID);
        $('.content-result').empty();
        dialogResult.showModal();
    })

    dialogResult.addEventListener("click", e => {
        const dialogDimensions = dialogResult.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            dialogResult.close();
            listDishes.splice(0, listDishes.length);
        }
    })

    function callAPIGetResultDishes(listDishID) {
        $.ajax({
            url: 'https://kltn-refrigeratorapp.onrender.com/RecommendSurvey?action=3',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(listDishID),
            success: function (data) {
                renderResultDishes(data);
            },
            error: function (jqxhr, textStatus, error) {
                // Handle errors here
                console.log("Error call API: " + error);
            }
        });
    }

    function renderResultDishes(listDishes) {
        for (let item of listDishes) {
            var htmlContent = '<div class="dish-result-container">';
            if (item.isSelected) {
                htmlContent += '<input type="checkbox" checked name="" id="">';
            } else {
                htmlContent += '<input type="checkbox" name="" id="">';
            };
            htmlContent += '<div class="card-dishes">' +
                '<img src="' + item.dish_image + '" alt="' + item.dish_name + '">' +
                '<div class="intro">' +
                '<h2>' + item.dish_name + '</h2>' +
                '</div>' +
                '</div>' +
                '<div class="progress-bar">' +
                '<div class="circular-progress">' +
                '<span class="progress-value">' + item.weight * 100 +'%</span>' +
                '</div>' +
                '<span class="text">Weight</span>' +
                '</div>' +
                '</div>';

            var newElement = $(htmlContent);
            const circularProgress = newElement.find('.circular-progress')[0];
            circularProgress.style.background = `conic-gradient(#7d2ae8 ${item.weight * 100 * 3.6}deg, #ededed 0deg)`;
            
            $('.content-result').append(newElement);
        }
    }
});