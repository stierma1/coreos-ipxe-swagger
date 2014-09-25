var Fiber = require('fibers');
var Promise = require('bluebird');
module.exports.checkThrow = function(data){
  if(data instanceof Error){
    throw data;
  }
}

module.exports.yield = function(promise){
  if(!(promise instanceof Promise)){
    throw Error("argument must be an instance of a bluebird promise")
  }
  var error;
  var data;

  var current = Fiber.current;

  promise.then(function(dat){
    data = dat;
  }).catch(function(err){
    error = err;
  }).finally(function(){
    current.run();
  });

  Fiber.yield();
  if(error){
    throw error;
  }
  return data;
}

module.exports.yieldPromise = function(promise){
  if(!(promise instanceof Promise)){
    throw Error("argument must be an instance of a bluebird promise")
  }
  var current = Fiber.current;
  promise.finally(function(){
    current.run();
  });
  Fiber.yield();
  return promise;
}

var criticals = [];

module.exports.wrapCritical = function(func){
  for(var i = 0; i < criticals.length; i++){
    if(func === criticals[i].originalFunc){
      return criticals[i].wrapedFunc;
    }
  }
  var crit = {
    originalFunc:func,
    queue:[],
    runLock: false
  }
  crit.run = function(){
      if(this.runLock || this.queue.length === 0){
        return;
      }
      this.runLock = true;
      var item = this.queue.shift();
      Fiber(function(){
        try{
          item.ansCB(crit.originalFunc.apply(item.ctx, item.args))
        }catch(err){
          item.errorCB(err)
        } finally{
          crit.runLock = false;
          setTimeout(crit.run, 0);
          item.fiber.run();
        }
      }).run();
    }.bind(crit);

  crit.wrapedFunc = function(){
      var current = Fiber.current;
      var ans;
      var error;
      crit.queue.push(
      {
        fiber:current,
        args:arguments,
        ansCB:function(data){ans = data},
        errorCB:function(err){error = err;},
        ctx: this
      });

      setTimeout(crit.run, 0)
      Fiber.yield();
      if(error){
        throw error;
      } else{
        return ans;
      }

    }

  criticals.push(crit);
  return crit.wrapedFunc;
}
