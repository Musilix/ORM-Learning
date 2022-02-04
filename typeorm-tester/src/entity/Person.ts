import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn} from "typeorm";

@Entity({
    name: "Person", //not necessary really, as class name is used if name field isn't provided
    schema: "people",
    database: "PEOPLEHUB" //may not be necesary as we specify in the ormconfig
})
export class Person {
    // This is similar to the PrimaryKey decorator, but also marks it as an auto-generated table value
    // we can provide several args to set up the generator strategy - increment, identity, uuid, and rowid
    // In our case, we want to use increament, which will either use AUTO_INC, SERIAL, or SEQUENCE depending on the DB we're using (SERIAL in our case)
    @PrimaryGeneratedColumn("increment") 
    id: number;

    @Column({type: 'text', nullable: true, default: 'Anon'})
    name: string;

    // Makring with this decorator will allow typeorm to automatically set this field to the current date, when insert() is called.
    // Remember, if save() is called with an Entity that is already in the Table, it will in turn be an update() call.
    // -- if save() is called on an Entity that doesn't already exist, then insert() is used instead
    @CreateDateColumn()
    created_date: Date;

    // This is similar to the above decorator, but instead will auto fill with the current date on all save() calls 
    @UpdateDateColumn()
    updated_date: Date;

    @Column({type: 'text', nullable: true, default: 'Seems like this person likes to keep their life secret... strange'})
    bio: string;
} 