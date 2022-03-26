document.addEventListener('DOMContentLoaded', ()=> {
    const showPlannerBtn = document.getElementById('show-planner-btn');
    const startWorkoutBtn = document.getElementById('start-workout-btn');
    const hidePlannerBtn = document.getElementById('hide-planner-btn');    
    const plannerContainer = document.getElementById('planner-container');
    const addExerciseBtn = document.getElementById('add-exercise-btn');
    const zonesTypeForm = document.getElementById('zones-type-form');    
    const ageInput = document.getElementById('age-container');
    const exercisesGeneratorContainer = document.getElementById('exercises-generator-container');
    const exercisesTimelineContainer = document.getElementById('timeline-container');
    const workoutInProgressContainer = document.getElementById('workout-in-progress-container');
    const workoutTimeSpan = document.getElementById('workout-time');
    const workoutTimeDisplay = document.getElementById('main-timer');
    const workoutTimeLeftSpan = document.getElementById('workout-countdown');
    const timeLeftDisplay = document.getElementById('main-countdown');    
    const exerciseName = document.getElementById('current-exe-name');
    const currentExerciseTimeSpan = document.getElementById('current-exe-time');
    const currentExerciseTimeDisplay = document.getElementById('current-exe-timer');
    const exerciseTimeLeftSpan = document.getElementById('current-exe-time-left');
    const exerciseTimeLeftDisplay = document.getElementById('current-exe-countdown');
    const exercisePowerZonesDisplay = document.getElementById('current-exe-zones');
    const exerciseCadenceZonesDisplay = document.getElementById('current-exe-cadence-zones');
    const exercisesNotesDisplay = document.getElementById('current-exe-notes');
    const nextExeDurationDislay = document.getElementById('next-exe-time');
    const nextExePowerZonesDisplay = document.getElementById('next-exe-zones');
    const nextExeCadenceZonesDisplay = document.getElementById('next-exe-cadence-zones');
    const nextExeNotesDisplay = document.getElementById('next-exe-notes')  ; 
    const commingNext = document.getElementById('comming-next');
    const clonedExercisesTimelineContainer = document.getElementById('sixth-row');
    let currentExerciseId = 0;
    let ftp = 0;
    let hrMax = 185;
    let limitType = 'ftp';
    let zonesUnit = 'W';
    let workoutDuration = 0;
    let workoutCurrentTime = 0;
    let exerciseCurrentTime = 0;
    let currentExerciseTimeUnit;       
    let clonedExerciesTimeline;      
    const workout = [];
    const exercisesForms = [];
    const exercisesTimelinesArr = [];    
    const clonedExercisesTimelineArr = [];   
    let exercisesStartingTimes = [];
    let timePointers;
    let timePointerArr = [];    
    let timePointerPosition = 0;       
    let intervalId;
    let exerciseInProgressIndex = 0;    
     
    
    //check what kind of zones do user want to use - Power or Heart Rate
    zonesTypeForm.addEventListener('change', checkZones);

    //add new exercise from and push exercise object to the workout array
    addExerciseBtn.addEventListener('click', addExercise);

    //hide exercises planner and start workout
    hidePlannerBtn.addEventListener('click', hidePlanner);

    //start workout
    startWorkoutBtn.addEventListener('click', startWorkout);

    //show exercises planner when training is paused
    showPlannerBtn.addEventListener('click', showPlanner);    

    //function checks what kind of zones do user want to use - Power or Heart Rate
    function checkZones (e) {
        if (e.target.name === "ftp") {
            ftp = e.target.value;
        }
        if (e.target.name === 'hrMax') {
            hrMax = e.target.value;
        }        
        limitType = zonesTypeForm.chosenZonesType.value;
        if (zonesTypeForm.chosenZonesType.value === 'ftp') {
            zonesUnit = 'W';
        } else if (zonesTypeForm.chosenZonesType.value === 'hrMax') {
            zonesUnit = 'BPM';
        }
        if (zonesTypeForm.doNotKnowMyHrMax.checked) {
            ageInput.style.display = 'flex';
        } else {
            ageInput.style.display = 'none';
        }
        if (zonesTypeForm.age.value < 0) {
            alert('Age value must be bigger than 0');
            zonesTypeForm.age.value = 1;
        }
        if (zonesTypeForm.age.value > 219) {
            alert('Are you serious???');
            zonesTypeForm.age.value = 1;
        }
        if (zonesTypeForm.doNotKnowMyHrMax.checked) {
            hrMax = 220 - zonesTypeForm.age.value;
            zonesTypeForm.hrMax.value = hrMax;
        }
        if (workout.length > 0) {
            renderExercisesTimelines(); //update exercises
        }
        if (exercisesForms.length > 0) { //if zones are based on hrMax, exercises zones can't go above hrMax            
            exercisesForms.forEach((element, index) => {
                if (element.upperLimit.value > hrMax && limitType === 'hrMax') {
                    element.upperLimit.value = hrMax;                    
                    workout[index].upperLimit = hrMax;
                }
                if (element.lowerLimit.value > hrMax && limitType === 'hrMax') {
                    element.lowerLimit.value = hrMax - 10;
                    workout[index].lowerLimit = hrMax - 10;
                }                
            })           
        }
                                        
    }

    function addExercise() {
        let exercise = new Exercise(currentExerciseId, '', 0, 'minutes', 0, 0, 0, 0, '');
        workout.push(exercise);
        addExerciseTimeline(currentExerciseId); //add exercise Timeline        
        addExerciseForm(currentExerciseId); //adds exercise from        
        currentExerciseId++;                     
    }

    //add exercise timeline
    function addExerciseTimeline(currentExerciseId) {
        const exerciseTimeline = document.createElement('div');
        exerciseTimeline.setAttribute('id', 'exeTimeline' + currentExerciseId);
        exercisesTimelineContainer.appendChild(exerciseTimeline);
        exercisesTimelinesArr.push(exerciseTimeline);        
    }

    //add exercise form
    function addExerciseForm(currentExerciseId) {
        const form = document.createElement('form');
        form.classList.add('add-exercise');
        form.dataset.id = currentExerciseId;
        form.setAttribute('name', 'exe' + currentExerciseId);
        form.setAttribute('id', 'exe' + currentExerciseId);
        exercisesGeneratorContainer.appendChild(form);
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
        durationInput.setAttribute('min', '0');
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
        //power/hr zones
        const zonesFieldset = document.createElement('fieldset');
        form.appendChild(zonesFieldset);
        const legend = document.createElement('legend');
        legend.innerText = 'zones';
        zonesFieldset.appendChild(legend);
        //zones type
        const limitTypeInputsContainer = document.createElement('div');
        limitTypeInputsContainer.classList.add('limit-type-inputs');
        zonesFieldset.appendChild(limitTypeInputsContainer);
        //power
        //inputs        
        //upper limit
        const upperLimitInputContainer = document.createElement('div');
        upperLimitInputContainer.classList.add('upper-limit-input-container');
        zonesFieldset.appendChild(upperLimitInputContainer);
        const upperLimitLabel = document.createElement('label');
        upperLimitLabel.setAttribute('for', 'upperLimit');
        upperLimitLabel.innerText = 'Upper limit';
        upperLimitInputContainer.appendChild(upperLimitLabel);
        const upperLimitInput = document.createElement('input');
        upperLimitInput.setAttribute('name', 'upperLimit');        
        upperLimitInput.setAttribute('type', 'number');
        upperLimitInput.setAttribute('id', 'upperLimit' + currentExerciseId);
        upperLimitInput.setAttribute('min', '0');       
        upperLimitInput.classList.add('number-input');
        upperLimitInputContainer.appendChild(upperLimitInput);
        //lower limit
        const lowerLimitInputContainer = document.createElement('div');
        lowerLimitInputContainer.classList.add('lower-limit-input-container');
        zonesFieldset.appendChild(lowerLimitInputContainer);
        const lowerLimitLabel = document.createElement('label');
        lowerLimitLabel.setAttribute('for', 'lowerLimit');
        lowerLimitLabel.innerText = 'Lower limit';
        lowerLimitInputContainer.appendChild(lowerLimitLabel);
        const lowerLimitInput = document.createElement('input');
        lowerLimitInput.setAttribute('name', 'lowerLimit');        
        lowerLimitInput.setAttribute('type', 'number');
        lowerLimitInput.setAttribute('id', 'lowerLimit' + currentExerciseId);
        lowerLimitInput.setAttribute('min', '0');        
        lowerLimitInput.classList.add('number-input');
        lowerLimitInputContainer.appendChild(lowerLimitInput);
        //cadence
        const cadenceFieldset = document.createElement('fieldset');
        form.appendChild(cadenceFieldset);
        const cadenceLegend = document.createElement('legend');
        cadenceLegend.innerText = 'Cadence zones';
        cadenceFieldset.appendChild(cadenceLegend);        
        //cadence upper limit
        const upperCadenceLimitInputContainer = document.createElement('div');
        upperCadenceLimitInputContainer.classList.add('upper-cadence-limit-input-container');
        cadenceFieldset.appendChild(upperCadenceLimitInputContainer);
        const cadenceUpperLimitLabel = document.createElement('label');
        cadenceUpperLimitLabel.setAttribute('for', 'upperCadenceLimit');
        cadenceUpperLimitLabel.innerText = 'Upper RPM limit';
        upperCadenceLimitInputContainer.appendChild(cadenceUpperLimitLabel);
        const cadenceUpperLimitInput = document.createElement('input');
        cadenceUpperLimitInput.setAttribute('name', 'upperCadenceLimit');        
        cadenceUpperLimitInput.setAttribute('type', 'number');
        cadenceUpperLimitInput.setAttribute('id', 'upperCadenceLimit' + currentExerciseId);
        cadenceUpperLimitInput.setAttribute('min', '0');
        cadenceUpperLimitInput.setAttribute('max', '300');       
        cadenceUpperLimitInput.classList.add('number-input');
        upperCadenceLimitInputContainer.appendChild(cadenceUpperLimitInput);
        //cadence lower limit
        const lowerCadenceLimitInputContainer = document.createElement('div');
        lowerCadenceLimitInputContainer.classList.add('lower-cadence-limit-input-container');
        cadenceFieldset.appendChild(lowerCadenceLimitInputContainer);
        const cadenceLowerLimitLabel = document.createElement('label');
        cadenceLowerLimitLabel.setAttribute('for', 'lowerCadenceLimit');
        cadenceLowerLimitLabel.innerText = 'Lower RPM limit';
        lowerCadenceLimitInputContainer.appendChild(cadenceLowerLimitLabel);
        const cadenceLowerLimitInput = document.createElement('input');
        cadenceLowerLimitInput.setAttribute('name', 'lowerCadenceLimit');        
        cadenceLowerLimitInput.setAttribute('type', 'number');
        cadenceLowerLimitInput.setAttribute('id', 'lowerCadenceLimit' + currentExerciseId);  
        cadenceLowerLimitInput.setAttribute('min', '0');  
        cadenceLowerLimitInput.setAttribute('max', '300');     
        cadenceLowerLimitInput.classList.add('number-input');
        lowerCadenceLimitInputContainer.appendChild(cadenceLowerLimitInput);        
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
        notesInput.setAttribute('maxlength', '20');        
        notesInput.classList.add('number-input');
        notesInputContainer.appendChild(notesInput);
        //add readForm function
        form.addEventListener('change', readForm)
        //push form to exercisesForms array
        exercisesForms.push(form);                     
    }

    //readForm function
    function readForm(e) {          
        const exerciseIndex = exercisesForms.indexOf(this);
        if ((workoutCurrentTime > 0 && exerciseIndex === exerciseInProgressIndex && this.durationUnit.value === 'seconds' && this.duration.value < exerciseCurrentTime)
            ||
            (workoutCurrentTime > 0 && exerciseIndex === exerciseInProgressIndex && this.durationUnit.value === 'minutes' && this.duration.value*60 < exerciseCurrentTime)
        ) {
            alert('You cannot travel in time!');            
            this.duration.value = workout[exerciseIndex].duration;
        }  
        if (e.target.name === 'duration' || e.target.name === 'id' ||
        e.target.name === 'lowerLimit' || e.target.name === 'upperLimit' ||
        e.target.name === 'lowerCadenceLimit' || e.target.name === 'upperCadenceLimit') {
            workout[exerciseIndex][e.target.name] = parseInt(e.target.value);                        
        } else {
            workout[exerciseIndex][e.target.name] = e.target.value;
        }
        
        if (e.target.name === 'upperLimit' && e.target.value < workout[exerciseIndex]['lowerLimit']) {
            alert('Upper limit cannot be lower than lower limit!');
            this.lowerLimit.value = 0;
            workout[exerciseIndex]['lowerLimit'] = 0;
        }
        if (e.target.name === 'upperCadenceLimit' && e.target.value < workout[exerciseIndex]['lowerCadenceLimit']) {
            alert('Upper limit cannot be lower than lower limit!');
            this.lowerCadenceLimit.value = 0;
            workout[exerciseIndex]['lowerCadenceLimit'] = 0;
        }
        if (e.target.name === 'upperLimit' && limitType === 'hrMax' && e.target.value > hrMax) {
            alert('You cannot go above your HrMax!');
            e.target.value = hrMax;
            workout[exerciseIndex]["upperLimit"] = hrMax;
        }
        if (e.target.name === 'lowerLimit' && e.target.value > workout[exerciseIndex]['upperLimit']) {
            alert('Lower limit cannot be higher than upper limit!');
            e.target.value = 0;
            workout[exerciseIndex]['lowerLimit'] = 0;
        }
        if (e.target.name === 'lowerLimit' && limitType === 'hrMax' && e.target.value > hrMax) {
            alert('You cannot go above your HrMax!');
            e.target.value = hrMax;
            workout[exerciseIndex]["lowerLimit"] = hrMax;
        }
        if (e.target.name === 'lowerCadenceLimit' && e.target.value > workout[exerciseIndex]['upperCadenceLimit']) {
            alert('Lower limit cannot be higher than upper limit!');
            e.target.value = 0;
            workout[exerciseIndex]['lowerCadenceLimit'] = 0;
        }               
        renderExercisesTimelines();
    }    

    //render Exercises Timelines
    function renderExercisesTimelines() {
        //if timePointer does exist - remove it, if not create
        if (timePointerArr.length > 0) {
            exercisesTimelineContainer.removeChild(timePointerArr[0]);
            timePointerArr.pop();
        } 
        let timePointer = document.createElement('div');
        timePointer.classList.add('time-pointer');        
        exercisesTimelineContainer.appendChild(timePointer);
        timePointerArr.push(timePointer);
        timePointers = document.querySelectorAll('.time-pointer');
        //move time pointer
        if (workout.length > 0) {
            checkTimePointerPosition();
            //we have to move time Pointer back as there is no time increase during rendering
            if (workout[exerciseInProgressIndex].durationUnit === 'seconds') {
                timePointerPosition -= 3;
            } else if (workout[exerciseInProgressIndex].durationUnit === 'minutes') {
                timePointerPosition -= 1;
            }
            moveTimePointer();
        }                             
        //count workout time
        workoutDuration = workout.reduce(function (total, current) {
            if (current.durationUnit === 'minutes') {
                return total + current.duration * 60;
            } else {
               return total + parseInt(current.duration);
            }            
        }, 0)        
        //setting divs width
        exercisesTimelinesArr.forEach((element, index) => {
            let currentExerciseDuration = 0;
            if (workout[index].durationUnit === 'minutes') {
                currentExerciseDuration = workout[index].duration * 60;
            } else {
                currentExerciseDuration = workout[index].duration * 3; //multiply for better visibility 
            }
            element.style.width = Math.round(currentExerciseDuration / workoutDuration * 10000) / 100 + '%';    
        })
        //counting div height
        if (limitType === 'hrMax') {   ///if zones based on hrMax
            exercisesTimelinesArr.forEach((element, index) => {                
            element.style.height = Math.round(workout[index].upperLimit / hrMax * 10000) / 100 + '%';
            if (workout[index].upperLimit > hrMax) {
                element.style.height = '100%';
            }
            //color divs
            element.style.backgroundImage = 'linear-gradient(to top, lightblue 0%, lightblue ' + Math.floor(hrMax / workout[index].upperLimit * 100 * 0.6) + '%, lightgreen ' + Math.floor(hrMax / workout[index].upperLimit * 100 * 0.6) + '%, lightgreen '  + Math.floor(hrMax / workout[index].upperLimit * 100 * 0.7) + '%, lightyellow ' + Math.floor(hrMax / workout[index].upperLimit * 100 * 0.7) + '%, lightyellow '  + Math.floor(hrMax / workout[index].upperLimit * 100 * 0.8) + '%, orange ' + Math.floor(hrMax / workout[index].upperLimit * 100 * 0.8) + '%, orange ' + Math.floor(hrMax / workout[index].upperLimit * 100 * 0.9) + '%, red ' + Math.floor(hrMax / workout[index].upperLimit * 100 * 0.9) + '%, red 100%)';
            //when zones exist draw border                               
            if (workout[index].lowerLimit >= 0 && workout[index].upperLimit > 0 && workout[index].duration > 0) {
            element.style.border = '1px solid black';
            }
            })
        } else if (limitType === 'ftp') {   //if zones based on power
            let exercisesTimelineHeightReferenceValue = workout.reduce(function (prevValue, currentValue) {          
            return Math.max(prevValue, currentValue.upperLimit);       //looking for biggest limit value      
            }, -1)            
                   
            //setting divs height and bacground color
            exercisesTimelinesArr.forEach((element, index) => {            
                element.style.height = Math.round(workout[index].upperLimit / exercisesTimelineHeightReferenceValue * 10000) / 100 + '%';
                //pick bgcolor corresponding to workout zone            
                if (ftp > 1) {   ///if user defined his ftp we color the divs
                    element.style.backgroundImage = 'linear-gradient(to top, lightblue 0%, lightblue ' + Math.floor(ftp / workout[index].upperLimit * 100 * 0.55) + '%, lightgreen ' + Math.floor(ftp / workout[index].upperLimit * 100 * 0.55) + '%, lightgreen '  + Math.floor(ftp / workout[index].upperLimit * 100 * 0.75) + '%, lightyellow ' + Math.floor(ftp / workout[index].upperLimit * 100 * 0.75) + '%, lightyellow '  + Math.floor(ftp / workout[index].upperLimit * 100 * 0.9) + '%, orange ' + Math.floor(ftp / workout[index].upperLimit * 100 * 0.9) + '%, orange ' + Math.floor(ftp / workout[index].upperLimit * 100 * 1.05 ) + '%, pink ' + Math.floor(ftp / workout[index].upperLimit * 100 * 1.05) + '%, pink ' + Math.floor(ftp / workout[index].upperLimit * 100 * 1.2) + '%, red ' + Math.floor(ftp / workout[index].upperLimit * 100 * 1.2) + '%, red ' + Math.floor(ftp / workout[index].upperLimit * 100 * 1.5) + '%, purple ' + Math.floor(ftp / workout[index].upperLimit * 100 * 1.5) + '%, purple ' + Math.floor(ftp / workout[index].upperLimit * 1000) + '%)';
                } else {                
                    element.style.backgroundImage = 'linear-gradient(to top, lightblue 0%, lightblue ' + Math.floor(workout[index].lowerLimit / workout[index].upperLimit * 100) + '%, grey ' + Math.floor(workout[index].lowerLimit / workout[index].upperLimit * 100) + '%, grey 100%)';
                }               
            //when zones exist draw border
            if (workout[index].lowerLimit >= 0 && workout[index].upperLimit > 0 && workout[index].duration) {
                element.style.border = '1px solid black';
                //draw timePointer
                timePointer.style.backgroundColor = 'orangered'; 
                }                        
            })
            
        }    
    }         

    //hidePlanner function
    function hidePlanner() {        
        //check if every exercise has neccessary data
        if ( workout.every(element => {
                return element.duration > 0 && element.lowerLimit > 0 && element.upperLimit > 0
            }) && workout.length > 0 ) {                
                plannerContainer.style.opacity = '0';        
                showPlannerBtn.style.display = 'inline-block';
                startWorkoutBtn.style.display = 'inline-block';
                setTimeout(()=> {
                    showPlannerBtn.style.opacity = '1';
                    startWorkoutBtn.style.opacity = '1';
                }, 1);
                setTimeout(()=>  plannerContainer.style.display = 'none', 999);
                workoutInProgressContainer.style.display = 'flex';
                workoutInProgressContainer.style.opacity = '0';
                setTimeout(()=> workoutInProgressContainer.style.opacity = '1', 999);
                //clone exercises timeline from planner
                cloneWorkoutTimeline();                        
                //exercises starting times
                setExercisesStartingTimes();                
        } else {
            alert('At least one exercise must be chosen and exercise duration, lower limit and upper limit must be higher than 0');
        }
        if (workoutCurrentTime > 0) {
            displayExercisesDetails();
            displayTime();
        }       
    }

    //show planner function
    function showPlanner () {
        clonedExercisesTimelineContainer.removeChild(clonedExercisesTimelineArr[0]);
        clonedExercisesTimelineArr.pop();
        showPlannerBtn.style.display = 'none';
        startWorkoutBtn.style.display = 'none';
        workoutInProgressContainer.style.display = 'none';
        plannerContainer.style.display = 'flex';
        plannerContainer.style.opacity = '1';
    }

    //clone workout timeline function
    function cloneWorkoutTimeline() {
        clonedExerciesTimeline = exercisesTimelineContainer.cloneNode(true);                         
        clonedExercisesTimelineContainer.appendChild(clonedExerciesTimeline);
        clonedExercisesTimelineArr.push(clonedExerciesTimeline);
        if (workoutCurrentTime === 0){
            workoutTimeDisplay.innerText = "workout duration " + getFormattedTime(workoutDuration);
        }         
    }

    //set exercises starting times function
    function setExercisesStartingTimes() {
        exercisesStartingTimes = [];
        let startingTime = 0;
        for (let i = 1; i <= workout.length; i++) {                
            exercisesStartingTimes.push(startingTime);
            if (workout[i-1].durationUnit === 'minutes') {
                startingTime += workout[i-1].duration*60;
            } else if (workout[i-1].durationUnit === 'seconds') {
                startingTime += workout[i-1].duration;
            }
        }
    }

    //start workout
    function startWorkout() {                       
        hidePlannerBtnFnc();        
        checkExerciseInProgress();
        displayExercisesDetails();        
        intervalId = setInterval(runTimers, 1000);
    }

    //hide planner button function
    function hidePlannerBtnFnc() {
        showPlannerBtn.style.display = 'none';
        startWorkoutBtn.innerText = 'Pause';
        startWorkoutBtn.removeEventListener('click', startWorkout);
        startWorkoutBtn.addEventListener('click', pause);
    }

    //function displays exercises names, durations, exercises time etc
    function displayExercisesDetails() {
        //display current exercise name
        if (workout[exerciseInProgressIndex].exerciseName) {
            exerciseName.style.display = 'inline-block';
            exerciseName.innerText = workout[exerciseInProgressIndex].exerciseName;
        } else {
            exerciseName.style.display = 'none';
        }
        //display exercise zones
        exercisePowerZonesDisplay.innerText = workout[exerciseInProgressIndex].lowerLimit + ' -' + workout[exerciseInProgressIndex].upperLimit + ' ' + zonesUnit;
        //display cadence zones
        if (workout[exerciseInProgressIndex].lowerCadenceLimit) {
            exerciseCadenceZonesDisplay.style.display = 'inline-block';
            exerciseCadenceZonesDisplay.innerText = workout[exerciseInProgressIndex].lowerCadenceLimit + ' -' + workout[exerciseInProgressIndex].upperCadenceLimit + ' RPM';
        } else {
            exerciseCadenceZonesDisplay.style.display = 'none';
        }
        //display notes
        if (workout[exerciseInProgressIndex].notes) {
            exercisesNotesDisplay.style.display = 'inline-block';
            exercisesNotesDisplay.innerText = workout[exerciseInProgressIndex].notes;
        } else {
            exercisesNotesDisplay.style.display = 'none';
        }
        //display next exercise
        if (workout[exerciseInProgressIndex + 1]) {
            commingNext.innerText = 'next:';
        }
        if (exerciseInProgressIndex === workout.length -1) {
            commingNext.style.visibility = 'hidden';
        }
        //display next exercise duration
        if (workout[exerciseInProgressIndex + 1]) {
            nextExeDurationDislay.style.display = 'inline-block';
            nextExeDurationDislay.innerText = 'Exercise duration: ' + getFormattedTime(workout[exerciseInProgressIndex + 1].duration);
        } else {
            nextExeDurationDislay.style.display = 'none';
        }
        //display next exercise zones
        if (workout[exerciseInProgressIndex + 1]) {
            nextExePowerZonesDisplay.innerText = workout[exerciseInProgressIndex + 1].lowerLimit + ' - ' + workout[exerciseInProgressIndex + 1].upperLimit + ' ' + zonesUnit;
        } else {
            nextExePowerZonesDisplay.style.display = 'none';
        }       
        //display next exe cadence zones
        if (workout[exerciseInProgressIndex + 1] && workout[exerciseInProgressIndex + 1].lowerCadenceLimit) {
            nextExeCadenceZonesDisplay.style.display = 'inline-block';
            nextExeCadenceZonesDisplay.innerText = workout[exerciseInProgressIndex + 1].lowerCadenceLimit + ' - ' + workout[exerciseInProgressIndex + 1].upperCadenceLimit + ' RPM';
        } else {
            nextExeCadenceZonesDisplay.style.display = 'none';
        }
        //display next exe notes
        if (workout[exerciseInProgressIndex + 1] && workout[exerciseInProgressIndex + 1].notes) {
            nextExeNotesDisplay.style.display = 'inline-block';
            nextExeNotesDisplay.innerText = workout[exerciseInProgressIndex + 1].notes;
        } else {
            nextExeNotesDisplay.style.display = 'none';
        } 
    }

    //function checking which exercise is in progress
    function checkExerciseInProgress() {
        if (workout.length > 1) {
            for (let i = 0; i < workout.length -1; i++) {                
                if (workoutCurrentTime +1 >= exercisesStartingTimes[i] && workoutCurrentTime < exercisesStartingTimes[i +1]) {
                    exerciseInProgressIndex = i;
                }                
            }
        }
        if (workoutCurrentTime +1 >= exercisesStartingTimes[workout.length -1]) {
            exerciseInProgressIndex = workout.length - 1;
        }
    }
    
    //functions responsible for updating and displaying workout time
    function runTimers() {
        //move timePointer
        moveTimePointer()          
        //check which exercise is currently in progress        
        checkExerciseInProgress();
        //when new exercise starts
        if (workoutCurrentTime > 1 && exercisesStartingTimes.includes(workoutCurrentTime + 1)) {
            exerciseCurrentTime = -1;
            displayExercisesDetails();
        };                      
        workoutCurrentTime++;
        exerciseCurrentTime++;        
        //display time and time left
        displayTime();
        //stop when workout is finished
        if (workoutCurrentTime === workoutDuration) {
            clearInterval(intervalId);
            startWorkoutBtn.removeEventListener('click', pause);
            startWorkoutBtn.innerText = 'Reload';
            startWorkoutBtn.addEventListener('click', reload); //reload page after workout
        }
    }

    //function moves timePointer
    function moveTimePointer() {
        timePointers = document.querySelectorAll('.time-pointer'); //if timelines was
        //cloned there are two TimePointers so we need to update our NodeList
        let workoutTimeLineWidth = workout.reduce((total, current) => {
            if(current.durationUnit === 'seconds') {
                return total += current.duration * 3
            } else if (current.durationUnit === 'minutes') {
                return total += current.duration * 60;
            }
        }, 0);              
        if (workout[exerciseInProgressIndex].durationUnit === 'minutes') {
            timePointerPosition++;
        } else if (workout[exerciseInProgressIndex].durationUnit === 'seconds') {
            timePointerPosition += 3;
        }        
        timePointers[0].style.left = timePointerPosition/workoutTimeLineWidth * 100 + '%';
        if (timePointers[1]) {
            timePointers[1].style.left = timePointerPosition/workoutTimeLineWidth * 100 + '%';
        }
        
    }

    //if we change exercises during training we must check if pointer position has changed
    function checkTimePointerPosition() {
        let newTimePointerPosition = 0;
        let sumOfDoneExercisesDurations = 0;        
        if (exerciseInProgressIndex === 0) {
            if (workout[0].durationUnit === 'minutes') {
                timePointerPosition = workoutCurrentTime;
            }
            if (workout[0].durationUnit === 'seconds') {
                timePointerPosition = workoutCurrentTime*3;
            }
        }
        if (exerciseInProgressIndex > 0) {
            for (let i = 0; i < workout.length; i++) {
                if(workout[i].durationUnit === 'seconds') {
                    newTimePointerPosition += workout[i].duration * 3;
                    sumOfDoneExercisesDurations += workout[i].duration;
                } else if (workout[i].durationUnit === 'minutes') {
                    newTimePointerPosition += workout[i].duration * 60;
                    sumOfDoneExercisesDurations += workout[i].duration * 60;
                }
                if (i+1 === exerciseInProgressIndex) {
                    let inProgressExeTime = workoutCurrentTime - sumOfDoneExercisesDurations;
                    if (workout[exerciseInProgressIndex].durationUnit === 'seconds') {
                        timePointerPosition = newTimePointerPosition + inProgressExeTime*3;
                    } else if (workout[exerciseInProgressIndex].durationUnit === 'minutes') {
                        timePointerPosition = newTimePointerPosition + inProgressExeTime;
                    }
                }
            }
        }     
    }

    //function displays time and time left
    function displayTime() {
        //timers
        workoutTimeSpan.innerText = 'Workout time: ';
        workoutTimeDisplay.innerText = getFormattedTime(workoutCurrentTime);
        currentExerciseTimeSpan.innerText = 'Exercise time: ';
        currentExerciseTimeDisplay.innerText = getFormattedTime(exerciseCurrentTime);
        //countdowns
        workoutTimeLeftSpan.innerText = 'Time left: ';
        timeLeftDisplay.innerText = getFormattedTime(workoutDuration - workoutCurrentTime);
        exerciseTimeLeftSpan.innerText = "Time left: ";        
        if (workout[exerciseInProgressIndex].durationUnit === "minutes") {
            exerciseTimeLeftDisplay.innerText = getFormattedTime(workout[exerciseInProgressIndex].duration*60 - exerciseCurrentTime);
        } else if (workout[exerciseInProgressIndex].durationUnit === "seconds") {
            exerciseTimeLeftDisplay.innerText = getFormattedTime(workout[exerciseInProgressIndex].duration - exerciseCurrentTime);
        }
    }
    
    function getFormattedTime(time) {
        let hours = Math.floor(time/3600);
        let minutes = Math.floor(time % 3600 / 60);
        let seconds = time % 60;
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return hours + ' : ' + minutes + ' : ' + seconds;
    }

    //exercise template
    class Exercise {
        constructor(id, name, duration, durationUnit, lowerLimit, upperLimit, lowerCadenceLimit, upperCadenceLimit, notes) {
            this.id = id;
            this.exerciseName = name;
            this.duration = duration;
            this.durationUnit = durationUnit;            
            this.lowerLimit = lowerLimit;
            this.upperLimit = upperLimit;
            this.lowerCadenceLimit = lowerCadenceLimit;
            this.upperCadenceLimit = upperCadenceLimit;            
            this.notes = notes;
        }
    }

    //function removes exercise
    function removeExercise(e) {
        e.preventDefault();               
        const thisForm = exercisesForms.filter(element => element.dataset.id === this.dataset.id)[0];
        const thisFormIndex = exercisesForms.indexOf(thisForm);
        if(thisFormIndex > exerciseInProgressIndex && workoutCurrentTime > 0 || workoutCurrentTime === 0) {
            exercisesGeneratorContainer.removeChild(thisForm);
            workout.splice(thisFormIndex, 1);
            exercisesTimelineContainer.removeChild(exercisesTimelinesArr[thisFormIndex]);
            exercisesTimelinesArr.splice(thisFormIndex, 1);       
            exercisesForms.splice(thisFormIndex, 1);
            renderExercisesTimelines(); 
        }               
               
    }

    //pause workout function
    function pause() {
        showPlannerBtnFnc();
        clearInterval(intervalId);        
    }

    //show planner button function
    function showPlannerBtnFnc() {
        showPlannerBtn.style.display = 'inline-block';
        startWorkoutBtn.innerText = 'Start';
        startWorkoutBtn.removeEventListener('click', pause);
        startWorkoutBtn.addEventListener('click', startWorkout);
    }

    //function reloads page after workout
    function reload() {
        window.location.reload(false);
    }
})