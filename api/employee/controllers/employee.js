const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**CREATE */
  async create(ctx) {
    let entity;

    const {
      FirstName,
      MiddleName,
      LastName,
      Email,
      PhoneNumber,
      NationalIDNumber,
      JobTitle,
      BirthDate,
      MaritalStatus,
      Gender,
      HireDate,
      SalariedFlag,
      VacationHours,
      SickLeaveHours,
      CurrentFlag,
    } = ctx.request.body;

    const personData = { FirstName, MiddleName, LastName, PhoneNumber, Email };

    /** Inicio Creando la persona */
    const personEntity = await strapi.services.person.create(personData);
    /** Fin Creando la persona */

    /** Creando el empleado */
    const employeeData = {
      NationalIDNumber,
      JobTitle,
      BirthDate,
      MaritalStatus,
      Gender,
      HireDate,
      SalariedFlag,
      VacationHours,
      SickLeaveHours,
      CurrentFlag,
      depto,
      PersonType: "EM",
      NameStyle: false,
      person: personEntity.id,
    };

    entity = await strapi.services.employee.create(employeeData);
    /** Fin Creando el empleado */

    if (Object.keys(depto).length) {
      await strapi.services.employee-department-history.create({employee: entity.id, department: parseInt(depto.value)});
    }
    return sanitizeEntity(entity, { model: strapi.models.employee });
  },
};
