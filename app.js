
import express from "express";
import mongoose from "mongoose";

const app = express();
const PORT = 3000;

app.use(express.json());


mongoose
  .connect("mongodb://localhost:27017/nodejs")
  .then(() => console.log(" Đã kết nối thành công MongoDB"))
  .catch((err) => console.error(" Kết nối MongoDB thất bại:", err));


const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, 
      minlength: 3,
    },
    description: {
      type: String,
      default: "Chưa có mô tả",
    },
  },
  {
    timestamps: true, 
  }
);

const Course = mongoose.model("Course", courseSchema);


app.get("/", (req, res) => {
  res.send(`
    <h1 style="font-family:sans-serif;">🚀 Course API đang hoạt động</h1>
    <p>Truy cập <a href="/api/courses">/api/courses</a> để xem danh sách khóa học</p>
  `);
});

app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách khóa học" });
  }
});

app.get("/api/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course)
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy khóa học" });
  }
});

app.post("/api/courses", async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi tạo khóa học", error });
  }
});
app.put("/api/courses/:id", async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } 
    );
    if (!updatedCourse)
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật khóa học" });
  }
});


app.delete("/api/courses/:id", async (req, res) => {
  try {
    const deleted = await Course.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy khóa học" });
    res.json({ success: true, message: "Đã xóa khóa học thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa khóa học" });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
