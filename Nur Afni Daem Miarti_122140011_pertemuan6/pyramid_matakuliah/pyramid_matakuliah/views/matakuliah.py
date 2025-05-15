import datetime
from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPFound,
    HTTPNotFound,
    HTTPBadRequest,
)
from ..models import Matakuliah


@view_config(route_name='matakuliah_list', renderer='json')
def matakuliah_list(request):
    """View untuk menampilkan daftar matakuliah"""
    dbsession = request.dbsession
    matkuls = dbsession.query(Matakuliah).all()
    return {'matakuliahs': [m.to_dict() for m in matkuls]}


@view_config(route_name='matakuliah_detail', renderer='json')
def matakuliah_detail(request):
    """View untuk melihat detail satu matakuliah"""
    dbsession = request.dbsession
    matkul_id = request.matchdict['id']
    matkul = dbsession.query(Matakuliah).filter_by(id=matkul_id).first()
    
    if matkul is None:
        return HTTPNotFound(json_body={'error': 'Matakuliah tidak ditemukan'})
    
    return {'matakuliah': matkul.to_dict()}


@view_config(route_name='matakuliah_add', request_method='POST', renderer='json')
def matakuliah_add(request):
    """View untuk menambahkan matakuliah baru"""
    try:
        json_data = request.json_body

        # Validasi field wajib
        required_fields = ['kode_mk', 'nama_mk', 'sks', 'semester']
        for field in required_fields:
            if field not in json_data:
                return HTTPBadRequest(json_body={'error': f'Field {field} wajib diisi'})
        
        # Buat objek Matakuliah baru
        matkul = Matakuliah(
            kode_mk=json_data['kode_mk'],
            nama_mk=json_data['nama_mk'],
            sks=json_data['sks'],
            semester=json_data['semester']
        )

        dbsession = request.dbsession
        dbsession.add(matkul)
        dbsession.flush()

        return {'success': True, 'matakuliah': matkul.to_dict()}
        
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='matakuliah_update', request_method='PUT', renderer='json')
def matakuliah_update(request):
    """View untuk mengupdate data matakuliah"""
    dbsession = request.dbsession
    matkul_id = request.matchdict['id']

    matkul = dbsession.query(Matakuliah).filter_by(id=matkul_id).first()
    if matkul is None:
        return HTTPNotFound(json_body={'error': 'Matakuliah tidak ditemukan'})
    
    try:
        json_data = request.json_body

        if 'kode_mk' in json_data:
            matkul.kode_mk = json_data['kode_mk']
        if 'nama_mk' in json_data:
            matkul.nama_mk = json_data['nama_mk']
        if 'sks' in json_data:
            matkul.sks = json_data['sks']
        if 'semester' in json_data:
            matkul.semester = json_data['semester']
        
        return {'success': True, 'matakuliah': matkul.to_dict()}
        
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})


@view_config(route_name='matakuliah_delete', request_method='DELETE', renderer='json')
def matakuliah_delete(request):
    """View untuk menghapus data matakuliah"""
    dbsession = request.dbsession
    matkul_id = request.matchdict['id']
    
    matkul = dbsession.query(Matakuliah).filter_by(id=matkul_id).first()
    if matkul is None:
        return HTTPNotFound(json_body={'error': 'Matakuliah tidak ditemukan'})
    
    dbsession.delete(matkul)
    
    return {'success': True, 'message': f'Matakuliah dengan id {matkul_id} berhasil dihapus'}
