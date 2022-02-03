document.addEventListener('DOMContentLoaded', ()=> {
    const showPlannerBtn = document.querySelector('.show-planner');    
    const plannerContainer = document.querySelector('.planner-container');
    const addExerciseBtn = document.querySelector('.add-exercise-btn');
    const exercisesContainer = document.querySelector('.exercises-container');
    let currentExerciseId = 0;
    const training = {};
    
    //add new exercise from and push exercise object to the training array
    addExerciseBtn.addEventListener('click', addExercise);
    function addExercise() {
        let exercise = new Exercise(0, true, 0, 0, 0, 0, false, '');
        training['id' + currentExerciseId] = exercise;
        currentExerciseId++;
        addExerciseForm(currentExerciseId); //adds exercise from
    }

    function addExerciseForm(currentExerciseId) {
        const form = document.createElement('form');
        form.classList.add('add-exercise');
        form.dataset.id = currentExerciseId;
        exercisesContainer.appendChild(form);
        const button = document.createElement('button');
        button.innerText = 'X';
        button.classList.add('remove-excercise-btn');
        button.dataset.id = currentExerciseId;
        button.addEventListener('click', removeExercise);
        form.appendChild(button);
        const durationInputContainer = document.createElement('div');
        
    }

    //remove exercise
    function removeExercise(e) {
        e.preventDefault();
        console.log('close ' + e.target.dataset.id)
    }

    //exercise template
    class Exercise {
        constructor(duration, power, downLimit, upLimit, downRPMLimit, upRPMLimit, rest, notes) {
            this.duration = duration;
            this.power = power;
            this.downLimit = downLimit;
            this.upLimit = upLimit;
            this.downRPMLimit = downRPMLimit;
            this.upRPMLimit = upRPMLimit;
            this.rest = rest;
            this.notes = notes;
        }
    }
    
    
})