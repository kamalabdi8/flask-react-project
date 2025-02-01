from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contacts.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'supersecretkey'  # Change in production

db = SQLAlchemy(app)
CORS(app)
jwt = JWTManager(app)

# Contact Model
class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email
        }

# Initialize DB
with app.app_context():
    db.create_all()

# Routes
@app.route('/contacts', methods=['GET'])
def get_contacts():
    contacts = Contact.query.all()
    return jsonify([contact.to_dict() for contact in contacts])

@app.route('/contact/<int:id>', methods=['GET'])
def get_contact(id):
    contact = Contact.query.get(id)
    if not contact:
        return jsonify({"error": "Contact not found"}), 404
    return jsonify(contact.to_dict())

@app.route('/create-contact', methods=['POST'])
def createcontact():
    data = request.get_json()

    if Contact.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400

    new_contact = Contact(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email']
    )
    db.session.add(new_contact)
    db.session.commit()
    return jsonify({"message": "Contact added successfully"}), 201

@app.route('/update-contact/<int:id>', methods=['PATCH'])
def update_contact(id):
    contact = Contact.query.get(id)
    if not contact:
        return jsonify({"error": "Contact not found"}), 404

    data = request.get_json()

    # Check if email is already in use by another contact
    if 'email' in data and data['email'] != contact.email:
        if Contact.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email already in use"}), 400
        contact.email = data['email']

    contact.first_name = data.get('first_name', contact.first_name)
    contact.last_name = data.get('last_name', contact.last_name)

    try:
        db.session.commit()
        return jsonify({"message": "Contact updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete-contact/<int:id>', methods=['DELETE'])
def delete_contact(id):
    contact = Contact.query.get(id)
    if not contact:
        return jsonify({"error": "Contact not found"}), 404

    try:
        db.session.delete(contact)
        db.session.commit()
        return jsonify({"message": "Contact deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    if email == "admin@example.com":  # Dummy check
        access_token = create_access_token(identity=email)
        return jsonify(access_token=access_token)
    return jsonify({"error": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(debug=True)
