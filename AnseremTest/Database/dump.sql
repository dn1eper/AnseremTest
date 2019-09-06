-- CREATE DATABASE
CREATE DATABASE AnseremTest
GO

USE AnseremTest;

CREATE TABLE dbo.City (
	CityID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	CityName varchar(25) NOT NULL
);
GO

CREATE TABLE dbo.Contact  (
	ContactID int IDENTITY(1,1) NOT NULL PRIMARY KEY,  
	FullName varchar(50) NOT NULL,
	Telephone varchar(25) NULL
);
GO

CREATE TABLE dbo.Partner (
	PartnerID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	PartnerName varchar(25) NOT NULL,
	ContactID int FOREIGN KEY (ContactID) REFERENCES Contact(ContactID), --контактное лицо
	CityID int FOREIGN KEY (CityID) REFERENCES City(CityID)
);
GO

CREATE TABLE dbo.Sale  (
	SaleID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	SaleName varchar(25) NOT NULL, 
	PartnerID int FOREIGN KEY (PartnerID) REFERENCES Partner(PartnerID),
	ContactID int FOREIGN KEY (ContactID) REFERENCES Contact(ContactID) --ответственный за продажу
);
GO

-- INSERT TEST DATA
INSERT dbo.City (CityName)  VALUES 
	('Москва'),
	('СПб');
GO

INSERT dbo.Contact (FullName, Telephone)  VALUES 
	('Петр Степанович', '+79001234567'),
	('Алиса Сергеевна', '+79007654321');
GO

INSERT dbo.Partner (PartnerName, CityID)  VALUES 
	('ООО Звезда', 1),
	('ПАО Газпром', 1),
	('ООО ПромТехСтрой', 2);
GO

INSERT dbo.Sale (SaleName, PartnerID, ContactID)  VALUES 
	('Продажа 1', 1, 1),
	('Продажа 2', 2, 2),
	('Просто продажа', NULL, NULL),
	('Продажа 5', 3, NULL),
	('Продажа 6', 2, 2);
GO