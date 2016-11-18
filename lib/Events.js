const Events = function(listeners){
  const events = this;

  events.listeners = Array.isArray(listeners)?listeners:[];

  const stages = ["first","before", "at", "after","last"];

  function sortByTime(a,b){
    return a.time>b.time?1:0;
  }

  function sortByPriorityThenTime(a,b){
    if(typeof a.priority == "undefined"){
      return (typeof b.priority == "undefined")?sortByTime(a,b):1;
    }
    if(typeof b.priority == "undefined"){
      return 0;
    }
    if(a.priority == b.priority) return sortByTime(a,b);
    return a.priority>b.priority ? 1:0;
  }

  events.sort = function(sort_by){
    events.listeners.sort(sortByPriorityThenTime);
  }

  events.emit = function(eventName){
    const context = this;
    const args = [].prototype.slice(arguments, 1);
    const hits = 0;

    const listeners = [[],[],[],[],[]];

    events.sort();

    for(var i=0; i < events.listeners.length; i++){
      const listener = events.listeners[i];
      const stage = stages.indexOf(listener.stage);
      if(stage > -1){
        listeners[stage].push(listener);
      }
    }
    return hits;
  }

  // Generate add methods for each stage:
  // e.g. first, add_first, at, add_at

  for(var s=0; s<events.stages.length; s++){
    const stage = events.stages[s];
    events[stage] = events["add_"+stage] = (function(stage){
      return function(eventName, listener, priority){
        if(typeof listener != "function"){
          return false;
        }
        const obj = {
          stage: stage,
          name: eventName,
          listener: listener,
          priority: priority,
          time: (new Date()).getTime()
        };
        events.listeners.push(obj);
        return obj;
      };
    })(stage);
    };
  }

  // Generate remove methods for each stage
  // e.g. remove_first, remove_at, remove_last
  for(var s=0; s<events.stages.length; s++){
    const stage = events.stages[s];
    events["remove_"+stage] = (function(stage){
      return function(eventName, listener, time){
        if(typeof listener != "function"){
          return false;
        }
        const listeners = [];
        for(var i=0; i<events.listeners.length; i++){
          const match = events.listeners[i];
          if(!(time == match.time || (stage == match.stage && eventName == match.name && listener == match.listener)){
            listeners.push(match);
          }
        }
        const removed = event.listeners.length - listeners.length;
        if(removed > 0){
          events.listeners = listeners;
        }
        return removed;
      };
    })(stage);
    };
  }
}

if(module){
  module.exports = Events;
}
