CREATE TABLE "form" (
	"id" SMALLSERIAL PRIMARY KEY,
	"form_name" VARCHAR(100) NOT NULL,
	"is_active" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE "subject" (
	"id" SERIAL PRIMARY KEY,
	"form_id" SMALLINT NOT NULL,
	"subject_name" VARCHAR(100) NOT NULL,
	"is_active" BOOLEAN NOT NULL DEFAULT TRUE,
	FOREIGN KEY("form_id") REFERENCES "form"("id")
);

CREATE TABLE "teacher" (
	"id" SERIAL PRIMARY KEY,
	"teacher_name" VARCHAR(255) NOT NULL,
	"ic" VARCHAR(20),
	"phone_number" VARCHAR(20) NOT NULL,
	"email" VARCHAR(255),
	"address" VARCHAR(255),
	"start_date" DATE NOT NULL DEFAULT CURRENT_DATE,
	"end_date" DATE CHECK("end_date" > "start_date"),
	"is_active" BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE "package_discount" (
	"id" SERIAL PRIMARY KEY,
	"start_date" DATE NOT NULL DEFAULT CURRENT_DATE,
	"end_date" DATE CHECK("end_date" > "start_date"),
	"form_id" SMALLINT NOT NULL,
	"subject_count_from" SMALLINT NOT NULL,
	"subject_count_to" SMALLINT,
	"discount_per_subject" REAL NOT NULL,
	FOREIGN KEY("form_id") REFERENCES "form"("id")
);

CREATE TABLE "class_registration" (
	"id" SERIAL PRIMARY KEY,
	"teacher_id" INT NOT NULL,
	"subject_id" INT NOT NULL,
	"start_date" DATE NOT NULL DEFAULT CURRENT_DATE,
	"end_date" DATE CHECK("end_date" > "start_date"),
	"class_year" SMALLINT NOT NULL CHECK("class_year" > 2000),
	"form_id" SMALLINT NOT NULL,
	"day" INT CHECK(
		"day" BETWEEN 1
		AND 7
	),
	"time" TIME,
	"fees" REAL NOT NULL,
	"is_package" BOOLEAN NOT NULL,
	FOREIGN KEY("teacher_id") REFERENCES "teacher"("id"),
	FOREIGN KEY("subject_id") REFERENCES "subject"("id"),
	FOREIGN KEY("form_id") REFERENCES "form"("id")
);

CREATE TABLE "student" (
	"id" SERIAL PRIMARY KEY,
	"student_name" VARCHAR(255) NOT NULL,
	"form_id" SMALLINT NOT NULL,
	"reg_date" DATE NOT NULL DEFAULT CURRENT_DATE,
	"reg_year" SMALLINT NOT NULL CHECK(reg_year > 2000),
	"gender" VARCHAR(20),
	"ic" VARCHAR(20),
	"school" VARCHAR(100),
	"phone_number" VARCHAR(20),
	"parent_phone_number" VARCHAR(20),
	"email" VARCHAR(255),
	"address" VARCHAR(255),
	"is_active" BOOLEAN NOT NULL DEFAULT TRUE,
	FOREIGN KEY("form_id") REFERENCES "form"("id")
);

CREATE TABLE "student_class" (
	"student_id" INT,
	"class_id" INT,
	"jan" BOOLEAN,
	"feb" BOOLEAN,
	"mar" BOOLEAN,
	"apr" BOOLEAN,
	"may" BOOLEAN,
	"jun" BOOLEAN,
	"jul" BOOLEAN,
	"aug" BOOLEAN,
	"sep" BOOLEAN,
	"oct" BOOLEAN,
	"nov" BOOLEAN,
	"dec" BOOLEAN,
	"is_active" BOOLEAN NOT NULL DEFAULT TRUE,
	PRIMARY KEY ("student_id", "class_id"),
	FOREIGN KEY("student_id") REFERENCES "student"("id"),
	FOREIGN KEY("class_id") REFERENCES "class_registration"("id")
);

CREATE TABLE "tax" (
	"id" SMALLSERIAL PRIMARY KEY,
	"percentage" REAL NOT NULL,
	"start_date" DATE NOT NULL DEFAULT CURRENT_DATE,
	"end_date" DATE CHECK("end_date" > "start_date"),
	"inclusive" BOOLEAN NOT NULL
);

CREATE TABLE "voucher" (
	"id" VARCHAR(255) PRIMARY KEY,
	"student_id" INT,
	"discount" REAL NOT NULL,
	"is_percentage" BOOLEAN NOT NULL DEFAULT FALSE,
	"start_date" DATE NOT NULL DEFAULT CURRENT_DATE,
	"expired_at" DATE NOT NULL,
	"used" BOOLEAN NOT NULL DEFAULT FALSE,
	FOREIGN KEY("student_id") REFERENCES "student"("id")
);

CREATE TABLE "receipt" (
	"id" SERIAL PRIMARY KEY,
	"student_id" INT NOT NULL,
	"date" DATE NOT NULL DEFAULT CURRENT_DATE,
	"payment_year" INT NOT NULL CHECK("payment_year" > 2000),
	"jan" REAL NOT NULL DEFAULT 0,
	"feb" REAL NOT NULL DEFAULT 0,
	"mar" REAL NOT NULL DEFAULT 0,
	"apr" REAL NOT NULL DEFAULT 0,
	"may" REAL NOT NULL DEFAULT 0,
	"jun" REAL NOT NULL DEFAULT 0,
	"jul" REAL NOT NULL DEFAULT 0,
	"aug" REAL NOT NULL DEFAULT 0,
	"sep" REAL NOT NULL DEFAULT 0,
	"oct" REAL NOT NULL DEFAULT 0,
	"nov" REAL NOT NULL DEFAULT 0,
	"dec" REAL NOT NULL DEFAULT 0,
	"package_discount" REAL NOT NULL,
	"reg_fees" REAL NOT NULL,
	"incentive" REAL NOT NULL,
	"voucher_id" VARCHAR(255),
	"voucher_discount" REAL NOT NULL,
	"tax" REAL NOT NULL,
	"remarks" VARCHAR(255),
	"status" VARCHAR(20) NOT NULL,
	FOREIGN KEY("student_id") REFERENCES "student"("id")
);

CREATE TABLE "receipt_class" (
	"receipt_id" INT,
	"class_id" INT,
	"fees" REAL NOT NULL,
	"is_package" BOOLEAN NOT NULL,
	PRIMARY KEY ("receipt_id", "class_id"),
	FOREIGN KEY("receipt_id") REFERENCES "receipt"("id"),
	FOREIGN KEY("class_id") REFERENCES "class_registration"("id")
);

CREATE TABLE "user" (
	"id" UUID PRIMARY KEY,
	"username" VARCHAR(255) NOT NULL UNIQUE,
	"password" VARCHAR(255) NOT NULL
);

CREATE TABLE "session" (
	"id" VARCHAR(255) PRIMARY KEY,
	"username" VARCHAR(255) NOT NULL,
	"login_time" TIMESTAMP WITH TIME ZONE NOT NULL,
	"last_active" TIMESTAMP WITH TIME ZONE NOT NULL CHECK("last_active" < "expired_at"),
	"expired_at" TIMESTAMP WITH TIME ZONE NOT NULL CHECK("expired_at" > "last_active")
);