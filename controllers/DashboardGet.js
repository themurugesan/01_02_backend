const Image = require("../models/product");
const Userschemadb = require("../models/user");

async function DashboardGet(req, res) {
    try {
        const images = await Image.find();
        const user = req.user;

        if (!user || !user.email) {
            return res.status(400).send({ message: "User information is missing" });
        }

        const check = await Userschemadb.findOne({ email: user.email });

        if (check) {
            const productIdsNotify = check.notify.map(item => item.title.toString());

            const validProducts = images.filter(product =>
                productIdsNotify.includes(product.title)
            );

            if (validProducts.length > 0) {
                const updatenotify = await Userschemadb.updateOne(
                    { email: user.email },
                    { $set: { checknotify: validProducts } }
                );

                const deletenotify = await Userschemadb.updateOne(
                    { email: user.email },
                    { $pull: { notify: { title: validProducts[0].title } } }
                );

                return res.status(200).send({ images });
            }

            return res.status(200).send({ images, valid: [] });
        } else {
            return res.status(404).send({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).send({ message: "Error fetching images", code: 401 });
    }
}

module.exports = DashboardGet;
