document.addEventListener('DOMContentLoaded', ()=> {
    const showPlannerBtn = document.querySelector('.show-planner');    
    const plannerContainer = document.querySelector('.planner-container');
    const addExerciseBtn = document.querySelector('.add-exercise-btn');
    const exercisesContainer = document.querySelector('.exercises-container');
    let currentExerciseId = 0;
    const training = [];
    const exercisesForms = [];
    
    //add new exercise from and push exercise object to the training array
    addExerciseBtn.addEventListener('click', addExercise);
    function addExercise() {
        let exercise = new Exercise(currentExerciseId, 0, true, 0, 0, 0, 0, false, '');
        training.push(exercise);        
        addExerciseForm(currentExerciseId); //adds exercise from
        currentExerciseId++;        
    }

    function addExerciseForm(currentExerciseId) {
        const form = document.createElement('form');
        form.classList.add('add-exercise');
        form.dataset.id = currentExerciseId;
        form.setAttribute('name', 'exe' + currentExerciseId);
        form.setAttribute('id', 'exe' + currentExerciseId);
        exercisesContainer.appendChild(form);
        const button = document.createElement('button');
        //close button
        button.innerText = 'X';
        button.classList.add('remove-excercise-btn');
        button.dataset.id = currentExerciseId;
        button.addEventListener('click', removeExercise);
        form.appendChild(button);
        //exercise name
        const exerciseNameContainer = document.createElement('div');
        exerciseNameContainer.classList.add('exercise-name-input-container');
        form.appendChild(exerciseNameContainer);
        const exerciseNameLabel = document.createElement('label');
        exerciseNameLabel.setAttribute('for', 'exerciseName');
        exerciseNameLabel.innerText = 'Exercise name';
        exerciseNameContainer.appendChild(exerciseNameLabel);
        const exerciseNameInput = document.createElement('input');
        exerciseNameInput.setAttribute('name', 'exerciseName');        
        exerciseNameInput.setAttribute('type', 'text');        
        exerciseNameInput.classList.add('number-input');
        exerciseNameContainer.appendChild(exerciseNameInput);
        //duration
        const durationInputContainer = document.createElement('div');
        durationInputContainer.classList.add('duration-input-container');
        form.appendChild(durationInputContainer);
        const durationLabel = document.createElement('label');
        durationLabel.setAttribute('for', 'duration');
        durationLabel.innerText = 'Duration';
        durationInputContainer.appendChild(durationLabel);
        const durationInput = document.createElement('input');
        durationInput.setAttribute('name', 'duration');
        durationInput.setAttribute('type', 'number');
        durationInput.classList.add('number-input');
        durationInputContainer.appendChild(durationInput);
        
        //power/hr limits
        const fieldset = document.createElement('fieldset');
        form.appendChild(fieldset);
        const legend = document.createElement('legend');
        legend.innerText = 'Limits';
        fieldset.appendChild(legend);
        //limits type
        const limitTypeInputsContainer = document.createElement('div');
        limitTypeInputsContainer.classList.add('limit-type-inputs');
        fieldset.appendChild(limitTypeInputsContainer);
        //power
        const limitPowerTypeInputContainer = document.createElement('div');
        limitPowerTypeInputContainer.classList.add('limit-power-type-input-container');        
        limitTypeInputsContainer.appendChild(limitPowerTypeInputContainer);
        const powerLabel = document.createElement('label');
        powerLabel.setAttribute('for', 'power');
        powerLabel.innerText = 'Power';
        limitPowerTypeInputContainer.appendChild(powerLabel);
        const powerInput = document.createElement('input');
        powerInput.setAttribute('name', 'limit-type');
        powerInput.setAttribute('id', 'power' + currentExerciseId);
        powerInput.setAttribute('value', 'power');
        powerInput.setAttribute('type', 'radio');
        powerInput.setAttribute('checked', true);
        powerInput.classList.add('number-input');
        limitPowerTypeInputContainer.appendChild(powerInput);
        //hr
        const limitHrTypeInputContainer = document.createElement('div');
        limitHrTypeInputContainer.classList.add('limit-hr-type-input-container');
        limitTypeInputsContainer.appendChild(limitHrTypeInputContainer);
        const hrLabel = document.createElement('label');
        hrLabel.setAttribute('for', 'hr');
        hrLabel.innerText = 'HR';
        limitHrTypeInputContainer.appendChild(hrLabel);
        const hrInput = document.createElement('input');
        hrInput.setAttribute('name', 'limit-type');
        hrInput.setAttribute('id', 'hr' + currentExerciseId);
        hrInput.setAttribute('value', 'hr');
        hrInput.setAttribute('type', 'radio');        
        hrInput.classList.add('number-input');
        limitHrTypeInputContainer.appendChild(hrInput);
        //inputs
        //lower limit
        const lowerLimitInputContainer = document.createElement('div');
        lowerLimitInputContainer.classList.add('lower-limit-input-container');
        fieldset.appendChild(lowerLimitInputContainer);
        const lowerLimitLabel = document.createElement('label');
        lowerLimitLabel.setAttribute('for', 'lower-limit');
        lowerLimitLabel.innerText = 'Lower limit';
        lowerLimitInputContainer.appendChild(lowerLimitLabel);
        const lowerLimitInput = document.createElement('input');
        lowerLimitInput.setAttribute('name', 'lower-limit');        
        lowerLimitInput.setAttribute('type', 'number');        
        lowerLimitInput.classList.add('number-input');
        lowerLimitInputContainer.appendChild(lowerLimitInput);
        //upper limit
        const upperLimitInputContainer = document.createElement('div');
        upperLimitInputContainer.classList.add('upper-limit-input-container');
        fieldset.appendChild(upperLimitInputContainer);
        const upperLimitLabel = document.createElement('label');
        upperLimitLabel.setAttribute('for', 'upper-limit');
        upperLimitLabel.innerText = 'Upper limit';
        upperLimitInputContainer.appendChild(upperLimitLabel);
        const upperLimitInput = document.createElement('input');
        upperLimitInput.setAttribute('name', 'upper-limit');        
        upperLimitInput.setAttribute('type', 'number');        
        upperLimitInput.classList.add('number-input');
        upperLimitInputContainer.appendChild(upperLimitInput);

        //cadence lower limit
        const lowerCadenceLimitInputContainer = document.createElement('div');
        lowerCadenceLimitInputContainer.classList.add('lower-cadence-limit-input-container');
        form.appendChild(lowerCadenceLimitInputContainer);
        const cadenceLowerLimitLabel = document.createElement('label');
        cadenceLowerLimitLabel.setAttribute('for', 'lower-cadence-limit');
        cadenceLowerLimitLabel.innerText = 'Lower RPM limit';
        lowerCadenceLimitInputContainer.appendChild(cadenceLowerLimitLabel);
        const cadenceLowerLimitInput = document.createElement('input');
        cadenceLowerLimitInput.setAttribute('name', 'lower-cadence-limit');        
        cadenceLowerLimitInput.setAttribute('type', 'number');        
        cadenceLowerLimitInput.classList.add('number-input');
        lowerCadenceLimitInputContainer.appendChild(cadenceLowerLimitInput);
        //cadence upper limit
        const upperCadenceLimitInputContainer = document.createElement('div');
        upperCadenceLimitInputContainer.classList.add('upper-cadence-limit-input-container');
        form.appendChild(upperCadenceLimitInputContainer);
        const cadenceUpperLimitLabel = document.createElement('label');
        cadenceUpperLimitLabel.setAttribute('for', 'upper-cadence-limit');
        cadenceUpperLimitLabel.innerText = 'Upper RPM limit';
        upperCadenceLimitInputContainer.appendChild(cadenceUpperLimitLabel);
        const cadenceUpperLimitInput = document.createElement('input');
        cadenceUpperLimitInput.setAttribute('name', 'upper-cadence-limit');        
        cadenceUpperLimitInput.setAttribute('type', 'number');        
        cadenceUpperLimitInput.classList.add('number-input');
        upperCadenceLimitInputContainer.appendChild(cadenceUpperLimitInput);
        //notes
        const notesInputContainer = document.createElement('div');
        notesInputContainer.classList.add('notes-input-container');
        form.appendChild(notesInputContainer);
        const notesLabel = document.createElement('label');
        notesLabel.setAttribute('for', 'notes');
        notesLabel.innerText = 'Notes';
        notesInputContainer.appendChild(notesLabel);
        const notesInput = document.createElement('input');
        notesInput.setAttribute('name', 'notes');        
        notesInput.setAttribute('type', 'text');        
        notesInput.classList.add('number-input');
        notesInputContainer.appendChild(notesInput);
        //add readForm function
        form.addEventListener('change', readForm)
        //push form to exercisesForms array
        exercisesForms.push(form);
        console.log(exercisesForms);
        console.log(training);        
    }

    //remove exercise
    function removeExercise(e) {
        e.preventDefault();
        const formToRemove = document.querySelector('form[data-id="' + e.target.dataset.id +'"]');
        exercisesContainer.removeChild(formToRemove);
        training.splice(exercisesForms.indexOf(formToRemove), 1); //remove exercise object
        exercisesForms.splice(exercisesForms.indexOf(formToRemove), 1); //remove exercise form
        console.log(exercisesForms);
        console.log(training);
    }

    //readForm function
    function readForm() {
        const exerciseName = this.querySelector('[name=exerciseName');
        const duration = this.querySelector('[name=duration]');
        const limitsType = this.querySelector('#power' + this.dataset.id);
        const lowerLimit = this.querySelector('[name=lower-limit]');
        const upperLimit = this.querySelector('[name=upper-limit]');
        const lowerCadenceLimit = this.querySelector('[name=lower-cadence-limit]');
        const upperCadenceLimit = this.querySelector('[name=upper-cadence-limit]');
        const notes = this.querySelector('[name=notes]');
        const exerciseIndex = exercisesForms.indexOf(this);

    }

    //exercise template
    class Exercise {
        constructor(id, duration, power, lowerLimit, upperLimit, lowerRPMLimit, upperRPMLimit, rest, notes) {
            this.id = id;
            this.duration = duration;
            this.power = power;
            this.lowerLimit = lowerLimit;
            this.upperLimit = upperLimit;
            this.lowerRPMLimit = lowerRPMLimit;
            this.upperRPMLimit = upperRPMLimit;
            this.rest = rest;
            this.notes = notes;
        }
    }
    
    
})