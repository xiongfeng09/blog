var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TopicSchema = new Schema({
    title: { type: String },
    content: { type: String },
    author_id: { type: ObjectId },
    visit_count: { type: Number, default: 0 },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
    category: {type: String},
    tag: {type: String}
});


mongoose.model('Topic', TopicSchema);
