define(['ko', 'moment', 'countdown' ,'math'], function (ko, moment, countdown, math) {

    var BuildViewModel = function (build) {
        this.isMenuVisible = ko.observable(false);

        this.id = ko.observable();
        this.isRunning = ko.observable();
        this.project = ko.observable();
        this.branch = ko.observable();
        this.commit = ko.observable();
        this.definition = ko.observable();
        this.number = ko.observable();
        this.startedAt = ko.observable();
        this.finishedAt = ko.observable();
        this.status = ko.observable(build.status);
        this.statusText = ko.observable();
        this.reason = ko.observable();
        this.requestedFor = ko.observable();
        this.hasWarnings = ko.observable();
        this.hasErrors = ko.observable();
        this.url = ko.observable();
        this.estimatedDuration = ko.observable();
        this.currentDuration = ko.observable();
        this.jobTimestamp = ko.observable();

        this.update = function (build) {
            this.id(build.id);
            this.isRunning(build.isRunning);
            this.project(build.project);
            this.branch(build.branch);
            this.commit(build.commit);
            this.definition(build.definition);
            this.number(build.number);
            this.startedAt(moment(build.startedAt));
            this.finishedAt(moment(build.finishedAt));
            this.status(build.status);
            this.statusText(build.statusText);
            this.reason(build.reason);
            this.requestedFor(build.requestedFor);
            this.hasWarnings(build.hasWarnings);
            this.hasErrors(build.hasErrors);
            this.url(build.url);
            this.estimatedDuration(build.estimatedDuration);
            this.currentDuration(build.currentDuration);
            this.jobTimestamp(build.jobTimestamp);
        };

        this.update(build);

        this.style = ko.computed(function () {
            if (this.status()) {
                return {
                    'color': 'white',
                    'background-color': this.status().toLowerCase()
                };
            }
        }, this);

        this.time = ko.forcibleComputed(function () {
            return this.isRunning() ?
                'started ' + moment(this.startedAt()).fromNow() :
                'finished ' + moment(this.finishedAt()).fromNow();
        }, this);

        this.duration = ko.forcibleComputed(function () {
            return this.isRunning() ?
                'running for ' + countdown(this.startedAt()).toString() :
                'ran for ' + countdown(this.startedAt(), this.finishedAt()).toString();
        }, this);

        this.isMenuAvailable = ko.computed(function () {
            return this.url() || false;
        }, this);

        this.progress = ko.computed(function () {
          if (this.isRunning()) {

            console.info("--------------------------------------------------");
            var startedAt = parseInt(this.jobTimestamp());
            console.info("startedAt=" + startedAt);

            var estimatedDuration = parseInt(this.estimatedDuration());
            console.info("estimatedDuration=" + estimatedDuration)

            var estimatedEnding = startedAt + estimatedDuration;
            console.info("estimatedEnding=" + estimatedEnding);

            var now = parseInt(moment().valueOf());
            console.info("now=" + now);

            var estimatedTimeLeft = estimatedEnding - now;
            console.info("estimatedTimeLeft=" + estimatedTimeLeft);

            var progress = parseInt(math.multiply(100,math.divide(estimatedTimeLeft, estimatedDuration)));
            console.info("progress=" +progress);

            return progress > 100 ? '100%' : progress + "%";
          }
          return 0;
        }, this);

        this.outerStyle = ko.computed(function() {
          if (this.status()) {
            return this.status().toLowerCase();
          }
        }, this);

        this.styleClass =  ko.computed(function () {
          if (this.status()) {
            var styleclass = '';
            if(this.isRunning()){
              styleclass += 'running '
            }
            styleclass += this.status().toLowerCase();
            return styleclass;
          }
        }, this);
    };

    return BuildViewModel;
});
