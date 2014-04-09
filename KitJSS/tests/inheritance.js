/**
 * The testing inheritance classes
 * @param test
 */
exports.extends = function(test){
    var KExClass = new (require("../base/KExClass"))();

    function Animal(){
    }
    Animal.prototype.weight = function(){
        return 0;
    }

    KExClass.extend(Dog, Animal);
    function Dog(){
    }
    Dog.prototype.weight = function(){
        return 5;
    }
    var dog = new Dog();
    test.ok(dog.weight() == 5, "dog.weight() == 5");

    //
    KExClass.extend(SuperDog, Dog);
    function SuperDog(){
    }
    SuperDog.prototype.weight = function(){
        return SuperDog.super.weight() * 3;
    }
    var super_dog = new SuperDog();
    test.ok(super_dog.weight() == 15, "super_dog.weight() == 15")

    //
    KExClass.extend(EvilSuperDog, SuperDog);
    function EvilSuperDog(){
    }
    var evil_super_dog = new EvilSuperDog();
    test.ok(evil_super_dog.weight() == 15, "evil_super_dog.weight() == 15")

    // выполнение
    test.done();
};