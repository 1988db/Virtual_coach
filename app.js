document.addEventListener('DOMContentLoaded', ()=> {
    const showPlannerBtn = document.querySelector('.show-planner');    
    const plannerContainer = document.querySelector('.planner-container');
    const addExerciseBtn = document.querySelector('.add-exercise-btn');
    const limitForm = document.getElementById('limits');
    const ftpInput = document.getElementById('ftp');
    const hrMaxInput = document.getElementById('hrMax');
    const exercisesContainer = document.querySelector('.exercises-container');
    let currentExerciseId = 0;
    trainingTime = 0;
    const exercisesTimeline = document.querySelector('.timeline-container')
    const training = [];
    const exercisesForms = [];
    const exercisesTimelines = [];    
    let ftp = 0;
    let hrMax = 0;

    //take data from limits form
    limitForm.addEventListener('change', setLimits);

    //set Limits function
    function setLimits () {
        ftp = ftpInput.value;
        hrMax = hrMaxInput.value;        
        if (training.length > 0) {
            renderExercisesTimelines(); //update exercises
        }
    }
    
    //add new exercise from and push exercise object to the training array
    addExerciseBtn.addEventListener('click', addExercise);
    function addExercise() {
        let exercise = new Exercise(currentExerciseId, '', 0, 'minutes', 'power', 0, 0, 0, 0, '');
        training.push(exercise);        
        addExerciseForm(currentExerciseId); //adds exercise from
        addExerciseTimeline(currentExerciseId); //add exercise Timeline
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
        button.setAttribute('id', 'btn' + currentExerciseId);
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
        exerciseNameInput.setAttribute('id', 'name' + currentExerciseId);        
        exerciseNameInput.classList.add('number-input');
        exerciseNameContainer.appendChild(exerciseNameInput);
        //duration
        const durationFieldset = document.createElement('fieldset');
        form.appendChild(durationFieldset);
        const durationLegend = document.createElement('legend');
        durationLegend.innerText = 'Duration';
        durationFieldset.appendChild(durationLegend);

        const durationInputContainer = document.createElement('div');
        durationInputContainer.classList.add('duration-input-container');
        durationFieldset.appendChild(durationInputContainer);
        const durationLabel = document.createElement('label');
        durationLabel.setAttribute('for', 'duration');
        durationLabel.innerText = 'Duration';
        durationInputContainer.appendChild(durationLabel);
        const durationInput = document.createElement('input');
        durationInput.setAttribute('name', 'duration');
        durationInput.setAttribute('type', 'number');
        durationInput.setAttribute('id', 'duration' + currentExerciseId);
        durationInput.classList.add('number-input');
        durationInputContainer.appendChild(durationInput);
        //duration units
        const durationUnitsInputsContainer = document.createElement('div');
        durationUnitsInputsContainer.classList.add('duration-units-inputs');
        durationFieldset.appendChild(durationUnitsInputsContainer);
        //seconds        
        const durationSecondsUnitContainer = document.createElement('div');
        durationSecondsUnitContainer.classList.add('duration-seconds');        
        durationUnitsInputsContainer.appendChild(durationSecondsUnitContainer);
        const secondsLabel = document.createElement('label');
        secondsLabel.setAttribute('for', 'seconds');
        secondsLabel.innerText = 'Seconds';
        durationSecondsUnitContainer.appendChild(secondsLabel);
        const secondsInput = document.createElement('input');
        secondsInput.setAttribute('name', 'durationUnit');
        secondsInput.setAttribute('id', 'seconds' + currentExerciseId);
        secondsInput.setAttribute('value', 'seconds');
        secondsInput.setAttribute('type', 'radio');        
        secondsInput.classList.add('number-input');
        durationSecondsUnitContainer.appendChild(secondsInput);
        //minutes       
        const durationMinutesUnitContainer = document.createElement('div');
        durationMinutesUnitContainer.classList.add('duration-minutes');        
        durationUnitsInputsContainer.appendChild(durationMinutesUnitContainer);
        const minutesLabel = document.createElement('label');
        minutesLabel.setAttribute('for', 'minutes');
        minutesLabel.innerText = 'Minutes';
        durationMinutesUnitContainer.appendChild(minutesLabel);
        const minutesInput = document.createElement('input');
        minutesInput.setAttribute('name', 'durationUnit');
        minutesInput.setAttribute('id', 'minutes' + currentExerciseId);
        minutesInput.setAttribute('value', 'minutes');
        minutesInput.setAttribute('type', 'radio');
        minutesInput.setAttribute('checked', true);        
        minutesInput.classList.add('number-input');
        durationMinutesUnitContainer.appendChild(minutesInput);
        
        //power/hr limits
        const limitsFieldset = document.createElement('fieldset');
        form.appendChild(limitsFieldset);
        const legend = document.createElement('legend');
        legend.innerText = 'Limits';
        limitsFieldset.appendChild(legend);
        //limits type
        const limitTypeInputsContainer = document.createElement('div');
        limitTypeInputsContainer.classList.add('limit-type-inputs');
        limitsFieldset.appendChild(limitTypeInputsContainer);
        //power
        const limitPowerTypeInputContainer = document.createElement('div');
        limitPowerTypeInputContainer.classList.add('limit-power-type-input-container');        
        limitTypeInputsContainer.appendChild(limitPowerTypeInputContainer);
        const powerLabel = document.createElement('label');
        powerLabel.setAttribute('for', 'power');
        powerLabel.innerText = 'Power';
        limitPowerTypeInputContainer.appendChild(powerLabel);
        const powerInput = document.createElement('input');
        powerInput.setAttribute('name', 'limitType');
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
        hrInput.setAttribute('name', 'limitType');
        hrInput.setAttribute('id', 'hr' + currentExerciseId);
        hrInput.setAttribute('value', 'hr');
        hrInput.setAttribute('type', 'radio');        
        hrInput.classList.add('number-input');
        limitHrTypeInputContainer.appendChild(hrInput);
        //inputs
        //lower limit
        const lowerLimitInputContainer = document.createElement('div');
        lowerLimitInputContainer.classList.add('lower-limit-input-container');
        limitsFieldset.appendChild(lowerLimitInputContainer);
        const lowerLimitLabel = document.createElement('label');
        lowerLimitLabel.setAttribute('for', 'lowerLimit');
        lowerLimitLabel.innerText = 'Lower limit';
        lowerLimitInputContainer.appendChild(lowerLimitLabel);
        const lowerLimitInput = document.createElement('input');
        lowerLimitInput.setAttribute('name', 'lowerLimit');        
        lowerLimitInput.setAttribute('type', 'number');
        lowerLimitInput.setAttribute('id', 'lowerLimit' + currentExerciseId);        
        lowerLimitInput.classList.add('number-input');
        lowerLimitInputContainer.appendChild(lowerLimitInput);
        //upper limit
        const upperLimitInputContainer = document.createElement('div');
        upperLimitInputContainer.classList.add('upper-limit-input-container');
        limitsFieldset.appendChild(upperLimitInputContainer);
        const upperLimitLabel = document.createElement('label');
        upperLimitLabel.setAttribute('for', 'upperLimit');
        upperLimitLabel.innerText = 'Upper limit';
        upperLimitInputContainer.appendChild(upperLimitLabel);
        const upperLimitInput = document.createElement('input');
        upperLimitInput.setAttribute('name', 'upperLimit');        
        upperLimitInput.setAttribute('type', 'number');
        upperLimitInput.setAttribute('id', 'upperLimit' + currentExerciseId);       
        upperLimitInput.classList.add('number-input');
        upperLimitInputContainer.appendChild(upperLimitInput);

        //cadence lower limit
        const lowerCadenceLimitInputContainer = document.createElement('div');
        lowerCadenceLimitInputContainer.classList.add('lower-cadence-limit-input-container');
        form.appendChild(lowerCadenceLimitInputContainer);
        const cadenceLowerLimitLabel = document.createElement('label');
        cadenceLowerLimitLabel.setAttribute('for', 'lowerCadenceLimit');
        cadenceLowerLimitLabel.innerText = 'Lower RPM limit';
        lowerCadenceLimitInputContainer.appendChild(cadenceLowerLimitLabel);
        const cadenceLowerLimitInput = document.createElement('input');
        cadenceLowerLimitInput.setAttribute('name', 'lowerCadenceLimit');        
        cadenceLowerLimitInput.setAttribute('type', 'number');
        cadenceLowerLimitInput.setAttribute('id', 'lowerCadenceLimit' + currentExerciseId);         
        cadenceLowerLimitInput.classList.add('number-input');
        lowerCadenceLimitInputContainer.appendChild(cadenceLowerLimitInput);
        //cadence upper limit
        const upperCadenceLimitInputContainer = document.createElement('div');
        upperCadenceLimitInputContainer.classList.add('upper-cadence-limit-input-container');
        form.appendChild(upperCadenceLimitInputContainer);
        const cadenceUpperLimitLabel = document.createElement('label');
        cadenceUpperLimitLabel.setAttribute('for', 'upperCadenceLimit');
        cadenceUpperLimitLabel.innerText = 'Upper RPM limit';
        upperCadenceLimitInputContainer.appendChild(cadenceUpperLimitLabel);
        const cadenceUpperLimitInput = document.createElement('input');
        cadenceUpperLimitInput.setAttribute('name', 'upperCadenceLimit');        
        cadenceUpperLimitInput.setAttribute('type', 'number');
        cadenceUpperLimitInput.setAttribute('id', 'upperCadenceLimit' + currentExerciseId);       
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
        notesInput.setAttribute('id', 'notes' + currentExerciseId);        
        notesInput.classList.add('number-input');
        notesInputContainer.appendChild(notesInput);
        //add readForm function
        form.addEventListener('change', readForm)
        //push form to exercisesForms array
        exercisesForms.push(form);             
    }

    //remove exercise
    function removeExercise(e) {
        e.preventDefault();
        const formToRemove = document.querySelector('form[data-id="' + e.target.dataset.id +'"]');
        exercisesContainer.removeChild(formToRemove);
        trainingTime -= training[exercisesForms.indexOf(formToRemove)].duration; //reduce training time
        training.splice(exercisesForms.indexOf(formToRemove), 1); //remove exercise object
        exercisesTimelines.splice(exercisesForms.indexOf(formToRemove), 1); //remove exercise timeline div from array
        exercisesForms.splice(exercisesForms.indexOf(formToRemove), 1); //remove exercise form
        const exerciseTimelineToRemove = exercisesTimeline.querySelector('#exeTimeline' + e.target.dataset.id);
        exercisesTimeline.removeChild(exerciseTimelineToRemove); //remove exercise timeline
        
        renderExercisesTimelines()               
    }

    //readForm function
    function readForm(e) {        
        const exerciseIndex = exercisesForms.indexOf(this);
        if (e.target.name === 'duration' || e.target.name === 'id' ||
        e.target.name === 'lowerLimit' || e.target.name === 'upperLimit' ||
        e.target.name === 'lowerCadenceLimit' || e.target.name === 'upperCadenceLimit') {
            training[exerciseIndex][e.target.name] = parseInt(e.target.value);            
        } else {
            training[exerciseIndex][e.target.name] = e.target.value;
        }
        renderExercisesTimelines();
    }

    //add exercise timeline
    function addExerciseTimeline(currentExerciseId) {
        const exerciseTimeline = document.createElement('div');
        exerciseTimeline.setAttribute('id', 'exeTimeline' + currentExerciseId);
        exercisesTimeline.appendChild(exerciseTimeline);
        exercisesTimelines.push(exerciseTimeline);        
    }    

    //render Exercises Timelines
    function renderExercisesTimelines() {
        console.log(training);
        
        //count training time
        trainingTime = training.reduce(function (total, current) {
            if (current.durationUnit === 'minutes') {
                return total + current.duration * 60;
            } else {
               return total + parseInt(current.duration);
            }            
        }, 0)
        console.log(trainingTime);
        //setting divs width
        exercisesTimelines.forEach((element, index) => {
            let currentExerciseDuration = 0;
            if (training[index].durationUnit === 'minutes') {
                currentExerciseDuration = training[index].duration * 60;
            } else {
                currentExerciseDuration = training[index].duration * 3; //multiply for better visibility 
            }
            element.style.width = Math.round(currentExerciseDuration / trainingTime * 10000) / 100 + '%';
            console.log(element);
            
        })
        //counting div height
        let exercisesTimelineHeightReferenceValue = training.reduce(function (prevValue, currentValue) {            
            return Math.max(prevValue, currentValue.upperLimit);            
        }, -1) //looking for max limit value
        console.log('reference value ', exercisesTimelineHeightReferenceValue)
        //setting divs height and bacground color and border
        exercisesTimelines.forEach((element, index) => {            
            element.style.height = Math.round(training[index].upperLimit / exercisesTimelineHeightReferenceValue * 10000) / 100 + '%';
            element.style.backgroundImage =
            'linear-gradient(to top, yellow 0%, yellow ' + (training[index].lowerLimit / training[index].upperLimit *100) +
             '%, red ' + (training[index].lowerLimit / training[index].upperLimit *100) + '%, red 100%';
             //when limits exist draw border
             //if (training[index].lowerLimit >= 0 && training[index].upperLimit > 0) {
            // element.style.border = '1px solid black'; 
            //}                        
        })
    }

    //exercise template
    class Exercise {
        constructor(id, name, duration, durationUnit, limitType, lowerLimit, upperLimit, lowerCadenceLimit, upperCadenceLimit, notes) {
            this.id = id;
            this.exerciseName = name;
            this.duration = duration;
            this.durationUnit = durationUnit;
            this.limitType = limitType;
            this.lowerLimit = lowerLimit;
            this.upperLimit = upperLimit;
            this.lowerCadenceLimit = lowerCadenceLimit;
            this.upperCadenceLimit = upperCadenceLimit;            
            this.notes = notes;
        }
    }
    
    
})