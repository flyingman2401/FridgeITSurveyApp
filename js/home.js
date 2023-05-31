$(document).ready(function () {
    $('#form').on('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        // Validate gender
        var genderSelected = $('input[name="gender"]:checked').length > 0;
        if (!genderSelected) {
            alert('Please select a gender.');
            return;
        }

        // Validate age
        var ageValue = parseInt($('#age').val());
        if (isNaN(ageValue) || ageValue <= 0) {
            alert('Please enter a valid age.');
            $('#age').focus();
            return;
        }

        // Validate weight
        var weightValue = parseFloat($('#weight').val());
        if (isNaN(weightValue) || weightValue <= 0) {
            alert('Please enter a valid weight.');
            $('#weight').focus();
            return;
        }

        // Validate height
        var heightValue = parseFloat($('#height').val());
        if (isNaN(heightValue) || heightValue <= 0) {
            alert('Please enter a valid height.');
            $('#height').focus();
            return;
        }

        // Validate activity level
        var activityLevelValue = $('#activity-level').val();
        if (activityLevelValue === '') {
            alert('Please select an activity level.');
            return;
        }

        var sickValue = $('#sick').val();
        
        $(this).submit(function() {
            let collectData = {
                gender: genderSelected,
                age: ageValue,
                weight: weightValue,
                height: heightValue,
                activityLevel: activityLevelValue,
                sick: sickValue
            };
            callApiSubmitForm(collectData);
        });

        // Or you can perform other actions here

    });

    function callApiSubmitForm(collectData) {
        $.ajax({
            url: 'url',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(listFood),
            success: function (collectData) {
                window.location.href = 'page2.html';
            },
            error: function (jqxhr, textStatus, error) {
                // Handle errors here
                console.log("Error call API: " + error);
            }
        });
    }
    
});