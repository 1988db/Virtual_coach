document.addEventListener('DOMContentLoaded', ()=> {
    const showPlannerBtn = document.querySelector('.show-planner');    
    const plannerContainer = document.querySelector('.planner-container');
    const addExerciseBtn = document.querySelector('.add-exercise-btn');
    const training = [];
    
    //add new exercise from and push exercise object to the training array
    addExerciseBtn.addEventListener('click', addExercise);
    function addExercise() {
        let exercise = new Exercise(0, true, 0, 0, 0, 0, false, '');
        training.push(exercise);
        console.log(exercise);
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