const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /** UPDATE */
  async update(ctx) {
    const { id } = ctx.params;

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
      depto,
    } = ctx.request.body;

    /** Actualizando empleado */
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
      PersonType: "EM",
      NameStyle: false,
    };

    entity = await strapi.services.employee.update({ id }, employeeData);

    /** Actualizando datos de persona */
    const personData = {
      FirstName,
      MiddleName,
      LastName,
      PhoneNumber,
      Email,
    };

    await strapi.services.person.update({ id: entity.person.id }, personData);

    /** Actualizar departamento */
    let lastDepartment = [...entity.employeedepartmenthistories];
    if (lastDepartment.length) {
      let { id: rowId } = lastDepartment.pop();
      await strapi.services.employeedepartmenthistory.update(
        {
          id: rowId,
        },
        { department: parseInt(depto) }
      );
    } else {
      await strapi.services.employeedepartmenthistory.create({
        employee: entity.id,
        department: parseInt(depto),
      });
    }

    return sanitizeEntity(entity, { model: strapi.models.employee });
  },

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
      depto,
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
      PersonType: "EM",
      NameStyle: false,
      person: personEntity.id,
    };

    entity = await strapi.services.employee.create(employeeData);
    /** Fin Creando el empleado */

    await strapi.services.employeedepartmenthistory.create({
      employee: entity.id,
      department: parseInt(depto),
    });
    return sanitizeEntity(entity, { model: strapi.models.employee });
  },
};
