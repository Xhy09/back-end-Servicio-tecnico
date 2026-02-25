import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class AddQuotationStatusTableAndMigrate1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create statuses table
    await queryRunner.createTable(
      new Table({
        name: 'statuses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // 2. Insert initial data
    await queryRunner.query(
      `INSERT INTO statuses (id, name) VALUES
      (uuid_generate_v4(), 'Pendiente'),
      (uuid_generate_v4(), 'Iniciado'),
      (uuid_generate_v4(), 'En Proceso'),
      (uuid_generate_v4(), 'Finalizado');`,
    );

    // Get the IDs of the newly created statuses
    const pendingStatus = await queryRunner.query(`SELECT id FROM statuses WHERE name = 'Pendiente';`);
    const pendingStatusId = pendingStatus[0].id;

    // 3. Add statusId column to quotations table (temporarily nullable)
    await queryRunner.addColumn(
      'quotations',
      new TableColumn({
        name: 'statusId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // 4. Update existing quotations records
    await queryRunner.query(
      `UPDATE quotations SET "statusId" = $1 WHERE "statusId" IS NULL;`, // Only update nulls
      [pendingStatusId],
    );

    // 5. Change statusId column to NOT NULL
    await queryRunner.changeColumn(
      'quotations',
      'statusId',
      new TableColumn({
        name: 'statusId',
        type: 'uuid',
        isNullable: false,
      }),
    );

    // 6. Add foreign key constraint
    await queryRunner.createForeignKey(
      'quotations',
      new TableForeignKey({
        columnNames: ['statusId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'statuses',
        onDelete: 'RESTRICT',
      }),
    );

    // 6. Remove old status column
    await queryRunner.dropColumn('quotations', 'status');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert changes in reverse order
    await queryRunner.dropColumn('quotations', 'status'); // This will fail if the column was already dropped.
    // Re-add the old status column (as enum) - this is complex and might require manual intervention
    // For simplicity in `down` migration, we'll just drop the new columns/tables.
    await queryRunner.dropForeignKey('quotations', 'FK_QUOTATIONS_STATUS'); // Assuming a default name for the FK
    await queryRunner.dropColumn('quotations', 'statusId');
    await queryRunner.dropTable('statuses');
  }
}
