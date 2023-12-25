const registerUser = async (req, res) => {
    const { userName, fullName, email, avatar, password } = req.body
    console.log({ userName, fullName, email, avatar, password });
    res.status(200).json({ message: "ok" })

}

export { registerUser }