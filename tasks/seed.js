const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const bcrypt = require('bcryptjs');
const users = data.users;
const houses = data.houses;
const comments = data.comments;
const saltRounds = 5;

async function main() {
    const db = await dbConnection();
	await db.dropDatabase();
    
    const user1_pw = await bcrypt.hash('Festive', saltRounds);
	const user1 = await users.addUser('festive', 'festive@gmail.com', '823-608-2417', user1_pw);
	const house1 = await houses.addHouseForSeeding(
		'313 7th St, Downtown, NJ 07302', 
		'Downtown Charmer - 17 Mins to NYC!', 
		'2020-04-01', user1._id.toHexString(), 40.726246, -74.0481387, 'Entire home/apt', 4100
	);

	const user2_pw = await bcrypt.hash('Javier', saltRounds);
	const user2 = await users.addUser('javier', 'javier@gmail.com', '718-680-7937', user2_pw);
	const house2 = await houses.addHouseForSeeding(
		'38 Romaine Ave, Jersey City, NJ 07306', 
		'Beautiful apt., 10 min subway ride to Manhattan', 
		'2020-04-25', user2._id.toHexString(), 40.730931, -74.06998, 'Entire home/apt', 2950
	);

    const user3_pw = await bcrypt.hash('Martin', saltRounds);
	const user3 = await users.addUser('martin', 'martin@gmail.com', '913-607-0188', user3_pw);
	const house3 = await houses.addHouseForSeeding(
		'360 Marin Blvd, Downtown, NJ 07302', 
		'HUGE PENTHOUSE LUXURY!!', 
		'2020-04-11', user3._id.toHexString(), 40.7212416, -74.0407989, 'Entire home/apt', 3520
	);

	const user4_pw = await bcrypt.hash('Massimo', saltRounds);
	const user4 = await users.addUser('massimo', 'massimo@gmail.com', '234-440-2896', user4_pw);
	const house4 = await houses.addHouseForSeeding(
		'149 Terhune Ave, Greenville, NJ 07305', 
		'2 bedroom, minutes from bus stop to journal sq', 
		'2020-04-01', user4._id.toHexString(), 40.705586, -74.0969139, 'Entire home/apt', 2000
	);

	const user5_pw = await bcrypt.hash('Susan8', saltRounds);
    const user5 = await users.addUser('susan8', 'susan8@gmail.com', '394-566-3799', user5_pw);
	const house5 = await houses.addHouseForSeeding(
		'133 Lafayette St, Bergen Lafayette, NJ 07304', 
		'Jersey City, 1-Bedroom Garden Apt.', 
		'2020-04-23', user5._id.toHexString(), 40.7136919, -74.0633154, 'Entire home/apt', 2370
	);

	const user6_pw = await bcrypt.hash('Juliet', saltRounds);
    const user6 = await users.addUser('juliet', 'juliet@gmail.com', '201-573-8675', user6_pw);
	const house6 = await houses.addHouseForSeeding(
		'2091 John F. Kennedy Blvd, North Bergen, NJ 07047', 
		'BNB by NYC: You own 2Floors & 5 Room...Spread Out!', 
		'2020-05-02', user6._id.toHexString(), 40.7686981, -74.0405169, 'Private Room', 900
	);

    const user7_pw = await bcrypt.hash('Patricia', saltRounds);
	const user7 = await users.addUser('patricia', 'patricia@gmail.com', '297-829-9134', user7_pw);
	const house7 = await houses.addHouseForSeeding(
		'201 Washington St, Downtown, NJ 07302', 
		'Shared Room Downtown', 
		'2020-05-05', user7._id.toHexString(), 40.7140661, -74.038208, 'Shared Room', 695
	);

	const user8_pw = await bcrypt.hash('Charlaine', saltRounds);
	const user8 = await users.addUser('charlaine', 'charlaine@gmail.com', '425-545-3164', user8_pw);
	const house8 = await houses.addHouseForSeeding(
		'382 Van Horne St, Jersey City, NJ 07304', 
		'Minutes to Manhattan & Jersey Shore', 
		'2020-04-18', user8._id.toHexString(), 40.710149, -74.060111, 'Entire home/apt', 3180
	);
	const house9 = await houses.addHouseForSeeding(
		'7 Monitor St, Jersey City, NJ 07304', 
		'Minutes to Manhattan and NJ Shore', 
		'2020-04-18', user8._id.toHexString(), 40.7165239, -74.0580937, 'Entire home/apt', 2900
	);

	const user9_pw = await bcrypt.hash('Bozena', saltRounds);
	const user9 = await users.addUser('bozena', 'bozena@gmail.com', '201-391-2184', user9_pw);
	const house10 = await houses.addHouseForSeeding(
		'138 Leonard St, Jersey City, NJ 07307', 
		'Cozy Shared Room / Free WiFi / 25 Min To Time Sq', 
		'2020-04-27', user9._id.toHexString(), 40.757235, -74.049168, 'Shared Room', 500
	);

	const user10_pw = await bcrypt.hash('Merlin', saltRounds);
	const user10 = await users.addUser('merlin', 'merlin@gmail.com', '461-623-5141', user10_pw);
	const house11 = await houses.addHouseForSeeding(
		'175 Van Horne St, Jersey City, NJ 07304', 
		'Private room with own bathroom close to NYC', 
		'2020-05-01', user10._id.toHexString(), 40.7118974, -74.0652272, 'Private Room', 1190
	);
	const house12 = await houses.addHouseForSeeding(
		'291 Halladay St, Jersey City, NJ 07304', 
		'Large Room with private bathroom 20 min to Manhattan', 
		'2020-05-01', user10._id.toHexString(), 40.7125955, -74.0628522, 'Private Room', 1000
	);

	const user11_pw = await bcrypt.hash('Armanda', saltRounds);
	const user11 = await users.addUser('armanda', 'armanda@gmail.com', '341-227-7532', user11_pw);
	const house13 = await houses.addHouseForSeeding(
		'11 Saddlewood Ct, Downtown, NJ 07302', 
		'1500sf 1BR Loft: Open Plan+NYC View', 
		'2020-05-31', user11._id.toHexString(), 40.721962, -74.041651, 'Entire home/apt', 4200
	);

	const user12_pw = await bcrypt.hash('Micheal', saltRounds);
	const user12 = await users.addUser('micheal', 'micheal@gmail.com', '168-845-5686', user12_pw);
	const house14 = await houses.addHouseForSeeding(
		'321 8th St, Jersey City, NJ 07302', 
		'Your Own Apartment Two Stops Away', 
		'2020-06-02', user12._id.toHexString(), 40.7269078, -74.0479109, 'Entire home/apt', 3600
	);

	const user13_pw = await bcrypt.hash('Christopher', saltRounds);
	const user13 = await users.addUser('christopher', 'christopher@gmail.com', '723-611-4806', user13_pw);
	const house15 = await houses.addHouseForSeeding(
		'201 Newark Ave, Downtown, NJ 07302', 
		'LARGE SUNNY ROOM 15 MIN to NYC!', 
		'2020-05-18', user13._id.toHexString(), 40.7215897, -74.0464906, 'Private Room', 1500
	);

	const user14_pw = await bcrypt.hash('Robert', saltRounds);
	const user14 = await users.addUser('robert', 'robert@gmail.com', '272-470-8898', user14_pw);
	const house16 = await houses.addHouseForSeeding(
		'410 Marin Blvd, Downtown, NJ 07302', 
		'Lavish 2BR in Jersey City + Great Amenities', 
		'2020-05-19', user14._id.toHexString(), 40.7241331, -74.0374535, 'Hotel Room', 5000
	);

	const user15_pw = await bcrypt.hash('Faisal', saltRounds);
	const user15 = await users.addUser('faisal', 'faisal@gmail.com', '318-005-2442', user15_pw);
	const house17 = await houses.addHouseForSeeding(
		'609 Grove St, Jersey City, NJ 07310', 
		'Shared 2 bedrooms/ male only/ 6 min drive from Manhattan', 
		'2020-05-22', user15._id.toHexString(), 40.7325677, -74.0411308, 'Shared Room', 880
	);
	
	await houses.storedByUser(house1._id, user2._id.toHexString());
	await houses.storedByUser(house1._id, user5._id.toHexString());
	await houses.storedByUser(house1._id, user11._id.toHexString());

	await houses.storedByUser(house4._id, user5._id.toHexString());
	await houses.storedByUser(house4._id, user7._id.toHexString());

	await houses.storedByUser(house5._id, user2._id.toHexString());
	await houses.storedByUser(house5._id, user9._id.toHexString());
	await houses.storedByUser(house5._id, user14._id.toHexString());
	await houses.storedByUser(house5._id, user15._id.toHexString());

	await houses.storedByUser(house10._id, user6._id.toHexString());

	await houses.storedByUser(house12._id, user2._id.toHexString());
	await houses.storedByUser(house12._id, user5._id.toHexString());

	await houses.storedByUser(house16._id, user13._id.toHexString());

	await comments.addComment(user2._id.toHexString(), house1._id.toHexString(), "nice but a little bit expensive");
	await comments.addComment(user2._id.toHexString(), house3._id.toHexString(), "good!!");

	await comments.addComment(user8._id.toHexString(), house10._id.toHexString(), "wow only 500 is that real?");

	await comments.addComment(user12._id.toHexString(), house17._id.toHexString(), "Hi, are pets acceptible?");

	console.log('Done seeding database');
	await db.serverConfig.close();
}

main();