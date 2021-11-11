import Service from "./service"
import {Employee} from "./model/employee";

const employeesAddId = Service.getMaxIdEmployee() + 1;
const employeeAdded = new Employee(employeesAddId, "test", "test");
console.log(employeeAdded);

test('removeEmployee', () => {
        const employeesRemoved1 = Service.getEmployee().filter(empl => empl.id !== 1);
        expect(Service.removeEmployee(1).getEmployee())
            .toEqual(employeesRemoved1);
    }
);

test('addEmployee', () => {
        expect(Service.addEmployee(employeesAddId,"test", "test")).toEqual(employeeAdded);
    }
);

test('findByName', () => {

        expect(Service.findByName("test1")).toEqual(undefined);
        expect(Service.findByName("test1", "test")).toEqual(undefined);
        expect(Service.findByName("test", "test1")).toEqual(undefined);

        expect(Service.findByName("test")).toEqual(employeeAdded);
        expect(Service.findByName("", "test")).toEqual(employeeAdded);
        expect(Service.findByName("test", "test")).toEqual(employeeAdded);

    }
);

test('findById', () => {
        expect(Service.findById(1)).toEqual(undefined);
        expect(Service.findById(employeesAddId)).toEqual(employeeAdded);

    }
);

//
//     let id = -1;
//     const dt = new Date();
//     dt.setFullYear(dt.getFullYear() - 3);
//
//
//     bind("addPhone", () => {
//         addPhone(id, "99999999999");
//         return (findById(id).phones === ["99999999999"]);
//     });
//     bind("setDateOfBirth", () => {
//         setDateOfBirth(id, dt);
//         let empl = findById(id);
//         return (empl.dateOfBirth !== dt);
//     });
//     bind("getAge", () => {
//         let d = getAge(id);
//         return (d !== 3);
//     });
//
//     bind("getEmployeeInfo", () => {
//         console.log(getEmployeeInfo(id));
//         return false;
//     });
//     bind("getEmployeeJSON", () => {
//         console.log(getEmployeeJSON(id));
//         return false;
//     });
//     bind("removeEmployee", () => {
//         removeEmployee(id);
//         return (findByName("test1").length > 0 ||
//             findByName("test1", "test2").length > 0 ||
//             findByName(null, "test2").length > 0);
//     });
// }
//
// autoTest();